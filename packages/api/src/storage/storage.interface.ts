export interface StorageInterface {
  uploadFile: (filename: string, data: any) => Promise<string>;
  deleteFile: (filename: string) => Promise<void>;
  createSignedUrl: (filename: string, expiresIn: number) => Promise<string>;
  getPublicUrl: (filename: string) => string;
}
