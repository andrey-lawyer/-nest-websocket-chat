import {
  IsBase64,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { validateTextWithAllowedTags } from 'src/validation/validator';

export class SentMessageDto {
  @IsString()
  @IsNotEmpty()
  @Validate(validateTextWithAllowedTags)
  text: string;

  @IsOptional()
  @IsBase64()
  file: string | undefined;

  @IsOptional()
  fileType: string;
}

export class SentMessageWithPageDto extends SentMessageDto {
  @IsNumber()
  page: number;
}
