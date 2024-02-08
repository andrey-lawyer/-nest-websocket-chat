import {
  IsBase64,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Chat } from 'src/chat/chat.entity';
import { Member } from 'src/member/member.entity';
import { validateTextWithAllowedTags } from 'src/validation/validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @IsString()
  @IsNotEmpty()
  @Validate(validateTextWithAllowedTags)
  @Column()
  text: string;

  @IsOptional()
  @IsBase64()
  @Column({ nullable: true })
  file: string;

  @Column({ nullable: true })
  fileType: string;

  @ManyToOne(() => Member, (member) => member.comments)
  member: Member;

  @ManyToOne(() => Chat, (message) => message.comments)
  message: Chat;
}
