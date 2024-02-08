import { v2, ConfigOptions } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: async (): Promise<typeof v2> => {
    const cloudinaryConfig: ConfigOptions = {
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    };

    v2.config(cloudinaryConfig);

    return v2;
  },
};
