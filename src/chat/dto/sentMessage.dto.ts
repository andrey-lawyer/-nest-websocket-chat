import {
  IsBase64,
  IsNotEmpty,
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

  page?: number;

  @IsOptional()
  @IsBase64()
  file: string | undefined;

  @IsOptional()
  fileType: string;
}
