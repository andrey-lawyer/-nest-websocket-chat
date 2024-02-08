import { Member } from 'src/member/member.entity';
import { Comment } from 'src/comment/comment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import {
  IsBase64,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { validateTextWithAllowedTags } from 'src/validation/validator';

@Entity()
export class Chat {
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

  @ManyToOne(() => Member, (member) => member.chats)
  member: Member;

  @OneToMany(() => Comment, (comment) => comment.message)
  comments: Comment[];
}
