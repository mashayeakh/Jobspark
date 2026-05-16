import { v2 as cloudinary } from 'cloudinary';
import { envVars } from '../config/env';

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
    api_key: envVars.CLOUDINARY.API_KEY,
    api_secret: envVars.CLOUDINARY.API_SECRET,
});

export { cloudinary };