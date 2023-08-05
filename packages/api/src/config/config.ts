import path from 'path';
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

interface Config {
  JWT: JWT;
  Supabase: Supabase;
}

interface JWT {
  accessExpiresIn: number;
  refreshExpiresIn: number;
  accessSecret: string;
  refreshSecret: string;
}

interface Supabase {
  url: string;
  key: string;
  bucket: string;
}

export const config: Config = {
  JWT: {
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN as string),
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string),
    accessSecret: process.env.JWT_ACCESS_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  },
  Supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    bucket: process.env.NEXT_PUBLIC_SUPABASE_BUCKET as string,
  },
}
