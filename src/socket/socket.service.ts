import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as sharp from 'sharp';
import { Socket } from 'dgram';
import { Server } from 'http';
import { ChatService } from 'src/chat/chat.service';
import {
  SentMessageDto,
  SentMessageWithPageDto,
} from 'src/chat/dto/sentMessage.dto';
import { FilesService } from 'src/file/file.service';
import { AuthService } from 'src/auth/auth.service';
import { CommentService } from 'src/comment/comment.service';
import { SentCommentWithPageDto } from 'src/comment/dto/sentСomment.dto';
import { SortDto } from 'src/chat/dto/sort.dto';

@WebSocketGateway({ cors: true })
export class SocketService implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatService,
    private readonly filesService: FilesService,
    private readonly authService: AuthService,
    private readonly commentService: CommentService,
  ) {}

  @SubscribeMessage('server-add-comment')
  async handleAddComment(
    @MessageBody() data: SentCommentWithPageDto,
    @ConnectedSocket()
    client: Socket & { handshake: { auth: { token: string } } },
  ) {
    const user = await this.handleAuthentication(client);
    if (!user) return;

    const dataFile = await this.processFile(data);
    const newData = {
      text: data.text,
      file: dataFile?.fileUrl,
      fileType: dataFile?.fileType,
      messageId: data.messageId,
    };

    try {
      await this.commentService.saveComment(newData, user);
      const { messages, totalMessages } =
        await this.chatService.findAllMessagesAndTotal(data.page);
      client.emit('client-add-comment', { messages, totalMessages });
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('server-delete-comment')
  async handleDeleteComment(
    @MessageBody() data: { commentId: number; page: number },
    @ConnectedSocket()
    client: Socket & { handshake: { auth: { token: string } } },
  ) {
    const user = await this.handleAuthentication(client);
    if (!user) return;
    try {
      await this.commentService.deleteComment(data.commentId, user.id);
    } catch (err) {
      this.server.emit('error', 'You do not have permission to delete');
    }

    const { messages, totalMessages } =
      await this.chatService.findAllMessagesAndTotal(data.page);
    client.emit('client-delete-comment', { messages, totalMessages });
  }

  @WebSocketServer()
  server: Server;
  async handleConnection(client: Socket) {
    console.log('connected');
    const { messages, totalMessages } =
      await this.chatService.findAllMessagesAndTotal(1);
    client.emit('client-message', { messages, totalMessages });
  }

  @SubscribeMessage('server-message')
  async handleAddMessage(
    @MessageBody() data: SentMessageWithPageDto,
    @ConnectedSocket()
    client: Socket & { handshake: { auth: { token: string } } },
  ) {
    const user = await this.handleAuthentication(client);
    if (!user) return;

    const dataFile = await this.processFile(data);
    const newData = {
      text: data.text,
      file: dataFile?.fileUrl,
      fileType: dataFile?.fileType,
    };

    try {
      await this.chatService.saveMessage(newData, user);
      const { messages, totalMessages } =
        await this.chatService.findAllMessagesAndTotal(data.page);
      client.emit('client-message', { messages, totalMessages });
    } catch (err) {
      client.emit('error', err.message);
    }
  }

  @SubscribeMessage('server-pagination')
  async handleGetMessages(
    @MessageBody() page: number,
    @ConnectedSocket()
    client: Socket,
  ) {
    const { messages, totalMessages } =
      await this.chatService.findAllMessagesAndTotal(page);

    client.emit('client-pagination', { messages, totalMessages });
  }

  @SubscribeMessage('server-sort')
  async handleGetMessagesAndSort(
    @MessageBody() data: SortDto,

    @ConnectedSocket()
    client: Socket,
  ) {
    const { page, sortBy, sortOrder } = data;
    const { messages, totalMessages } =
      await this.chatService.findAllMessagesAndTotal(page, sortBy, sortOrder);

    client.emit('client-sort', { messages, totalMessages });
  }

  isValidFileType = (mimeType: string) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'text/plain'];
    return allowedTypes.includes(mimeType);
  };

  async resizeImageIfNeeded(
    buffer: Buffer,
    maxWidth: number,
    maxHeight: number,
  ): Promise<Buffer> {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    if (
      metadata.width &&
      metadata.height &&
      (metadata.width > maxWidth || metadata.height > maxHeight)
    ) {
      return image
        .resize({ width: maxWidth, height: maxHeight, fit: 'inside' })
        .toBuffer();
    }

    return buffer;
  }

  private async handleAuthentication(
    client: Socket & { handshake: { auth: { token: string } } },
  ) {
    const authToken = client.handshake.auth.token;

    try {
      const user = await this.authService.authenticateSocketUser(authToken);

      if (!user) {
        client.emit('auth-error', 'Invalid authentication token');
        return false;
      }

      return user;
    } catch (error) {
      client.emit('auth-error', error.message);
      return false;
    }
  }

  private async processFile(
    data: SentMessageDto,
  ): Promise<{ fileUrl?: string; fileType?: string } | null> {
    if (!data.file) {
      return null;
    }

    const matches = data.file.match(/^data:(.*?);base64,(.*)$/);

    // file type validation
    const mimeType = matches[1];

    const fileType = mimeType === 'text/plain' ? 'text' : 'image';
    if (!this.isValidFileType(mimeType)) {
      this.server.emit('error', 'Invalid file format');
      return null;
    }

    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // file size validation (only for texts)
    const fileSizeKB = buffer.length / 1024;
    if (mimeType === 'text/plain' && fileSizeKB > 100) {
      this.server.emit('error', 'Text file size exceeds the limit of 100 KB');
      return null;
    }

    let fileUrl: string | undefined;

    // reducing the size of the image to 320x240 pixels
    if (mimeType !== 'text/plain') {
      const maxWidth = 320;
      const maxHeight = 240;
      const resizedBuffer = await this.resizeImageIfNeeded(
        Buffer.from(base64Data, 'base64'),
        maxWidth,
        maxHeight,
      );

      fileUrl = await this.filesService.createFile(resizedBuffer);
    } else {
      fileUrl = await this.filesService.createFile(buffer);
    }

    return { fileUrl, fileType };
  }
}
