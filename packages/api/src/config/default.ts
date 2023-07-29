import path from 'path';
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const customConfig: {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  accessTokenKey: string;
  refreshTokenKey: string;
} = {
  accessTokenExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN as string),
  refreshTokenExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string),
  accessTokenKey: process.env.JWT_ACCESS_SECRET as string,
  refreshTokenKey: process.env.JWT_REFRESH_SECRET as string,
};

export default customConfig;
