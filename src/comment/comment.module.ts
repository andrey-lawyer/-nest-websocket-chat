import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comment/comment.entity';
import { Chat } from 'src/chat/chat.entity';

@Module({
  providers: [CommentService],
  exports: [CommentService],
  imports: [TypeOrmModule.forFeature([Comment, Chat])],
})
export class CommentModule {}
