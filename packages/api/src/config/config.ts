import path from "path";
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

interface Config {
  appUrl: string;
  appName: string;
  resendApiKey: string;
  resetPasswordPath: string;
  mailFromAddress: string;
  jwt: JWT;
  supabase: Supabase;
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
  appUrl: process.env.APP_URL as string,
  appName: process.env.APP_NAME as string,
  resendApiKey: process.env.RESEND_API_KEY as string,
  resetPasswordPath: process.env.RESET_PASSWORD_PATH as string,
  mailFromAddress: process.env.MAIL_FROM_ADDRESS as string,
  jwt: {
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN as string),
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string),
    accessSecret: process.env.JWT_ACCESS_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    bucket: process.env.NEXT_PUBLIC_SUPABASE_BUCKET as string,
  },
};
