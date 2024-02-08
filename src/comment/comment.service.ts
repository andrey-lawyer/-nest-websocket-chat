import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/comment/comment.entity';
import { IResponseMember } from 'src/auth/auth.service';
import { Chat } from 'src/chat/chat.entity';
import { SentCommentDto } from './dto/sentСomment.dto';
import { validateTextWithAllowedTags } from 'src/validation/validator';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async saveComment(
    data: SentCommentDto,
    member: IResponseMember,
  ): Promise<Comment> {
    if (!data.text.trim()) {
      throw new BadRequestException('Validation failed: Text cannot be empty');
    }
    data.text = `<div>${data.text}</div>`;
    if (!validateTextWithAllowedTags(data.text)) {
      throw new BadRequestException('Validation failed: Invalid HTML tags');
    }
    const message = await this.chatRepository.findOneOrFail({
      where: { id: data.messageId },
    });

    const newComment = this.commentRepository.create({
      text: data.text,
      file: data.file,
      fileType: data.fileType,
      member,
      message,
    });

    const savedComment = await this.commentRepository.save(newComment);
    return savedComment;
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id: commentId })
      .leftJoinAndSelect('comment.member', 'member')
      .getOneOrFail();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.member.id !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to delete this comment',
      );
    }

    await this.commentRepository.delete(commentId);
  }
}
