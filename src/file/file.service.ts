import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { v2, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
@Injectable()
export class FilesService {
  async createFile(buffer: Buffer): Promise<string> {
    try {
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          const uploadStream = v2.uploader.upload_stream(
            { resource_type: 'auto' },
            (
              error: UploadApiErrorResponse | undefined,
              result: UploadApiResponse | undefined,
            ) => {
              if (error) {
                reject(error);
              }
              if (result) {
                resolve(result);
              }
            },
          );

          stream.pipe(uploadStream);
        },
      );
      return uploadResult.secure_url;
    } catch (e) {
      console.error('Error processing file:', e);
      throw new HttpException(
        'Error processing file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
