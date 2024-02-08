import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Chat } from 'src/chat/chat.entity';
import { Comment } from 'src/comment/comment.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  homePage: string;

  @Column()
  avatar: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Chat, (chat) => chat.member)
  chats: Chat[];

  @OneToMany(() => Comment, (comment) => comment.member)
  comments: Comment[];
}
