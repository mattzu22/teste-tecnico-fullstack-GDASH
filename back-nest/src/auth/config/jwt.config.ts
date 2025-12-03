import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default_jwt_secret',
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600', 10),
}));
