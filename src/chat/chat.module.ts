import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Comment } from 'src/comment/comment.entity';
import { FilesModule } from 'src/file/file.module';

@Module({
  providers: [ChatService],
  exports: [ChatService],
  imports: [TypeOrmModule.forFeature([Chat, Comment]), FilesModule],
})
export class ChatModule {}
