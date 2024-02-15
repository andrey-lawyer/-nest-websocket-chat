import { BadRequestException, Injectable } from '@nestjs/common';
import * as xss from 'xss';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Repository } from 'typeorm';
import { SentMessageDto } from './dto/sentMessage.dto';
import { validateTextWithAllowedTags } from 'src/validation/validator';
import { IResponseMember } from 'src/member/responseMember.type';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async saveMessage(
    data: SentMessageDto,
    member: IResponseMember,
  ): Promise<Chat> {
    if (!data.text.trim()) {
      throw new BadRequestException('Validation failed: Text cannot be empty');
    }
    data.text = `<div>${xss.filterXSS(data.text)}</div>`;
    if (!validateTextWithAllowedTags(data.text)) {
      throw new BadRequestException('Validation failed: Invalid HTML tags');
    }
    const newMessage = this.chatRepository.create({
      text: data.text,
      file: data.file,
      fileType: data.fileType,
      member,
    });

    const savedMessage = await this.chatRepository.save(newMessage);
    return savedMessage;
  }

  async findAllMessagesAndTotal(
    page = 1,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ messages: Chat[]; totalMessages: number }> {
    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.member', 'member')
      .leftJoinAndSelect('chat.comments', 'comments')
      .leftJoinAndSelect('comments.member', 'commentMember')
      .skip((page - 1) * 25)
      .take(25);

    if (sortBy === 'name') {
      queryBuilder.orderBy('member.name', sortOrder);
    } else if (sortBy === 'email') {
      queryBuilder.orderBy('member.email', sortOrder);
    } else if (sortBy === 'createdAt') {
      queryBuilder.orderBy('chat.createdAt', sortOrder);
    }

    const [messages, totalMessages] = await queryBuilder.getManyAndCount();

    // Sanitize untrusted HTML (to prevent XSS)
    const sanitizedMessages = messages.map((message) => ({
      ...message,
      text: xss.filterXSS(message.text),
    }));

    return { messages: sanitizedMessages, totalMessages };
  }

  async deleteMessage(messageId: number): Promise<void> {
    await this.chatRepository.delete(messageId);
  }
}
