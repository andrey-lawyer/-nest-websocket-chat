import {
  IsBase64,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { validateTextWithAllowedTags } from 'src/validation/validator';

export class SentCommentDto {
  @IsString()
  @IsNotEmpty()
  @Validate(validateTextWithAllowedTags)
  text: string;

  @IsOptional()
  @IsBase64()
  file: string | undefined;

  @IsNotEmpty()
  messageId: number;

  @IsOptional()
  fileType: string;
}

export class SentCommentWithPageDto extends SentCommentDto {
  @IsNumber()
  page: number;
}
