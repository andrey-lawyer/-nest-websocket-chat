import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'validateTextWithAllowedTags', async: false })
export class ValidateTextWithAllowedTags
  implements ValidatorConstraintInterface
{
  validate(text: string) {
    const allowedTagsRegex =
      /^<div>(<\/?(a|code|i|strong)\b[^>]*>.*?<\/\2>|[^<>]+)*<\/div>$/;

    return allowedTagsRegex.test(text);
  }

  defaultMessage() {
    return 'Invalid HTML tags found in the text';
  }
}

export function validateTextWithAllowedTags(text: string) {
  return ValidateTextWithAllowedTags.prototype.validate(text);
}
