import { SupabaseClient, createClient } from "@supabase/supabase-js";
import mime from "mime";
import { StorageInterface } from "./storage.interface";
import { config } from "../config/config";

export class SupabaseStorage implements StorageInterface {
  bucket: string;
  supabaseClient: SupabaseClient;

  constructor() {
    const supabaseConfig = config.Supabase;
    this.bucket = supabaseConfig.bucket;
    this.supabaseClient = createClient(supabaseConfig.url, supabaseConfig.key);
  }

  async uploadFile(filename: string, file: any): Promise<string> {
    const contentType = mime.getType(filename) || "text/plain";
    const { data, error } = await this.supabaseClient.storage
      .from(this.bucket)
      .upload(filename, file, {
        cacheControl: "3600",
        contentType: contentType,
      });

    if (error) {
      throw error;
    }

    return data.path;
  }

  async deleteFile(filename: string): Promise<void> {
    const { error } = await this.supabaseClient.storage
      .from(this.bucket)
      .remove([filename]);

    if (error) {
      throw error;
    }
  }

  getPublicUrl(filename: string): string {
    const { data } = this.supabaseClient.storage
      .from(this.bucket)
      .getPublicUrl(filename);

    return data.publicUrl;
  }

  async createSignedUrl(filename: string, expiresIn: number): Promise<string> {
    const { data, error } = await this.supabaseClient.storage
      .from(this.bucket)
      .createSignedUrl(filename, expiresIn);

    if (error) {
      throw error;
    }

    return data.signedUrl;
  }
}
