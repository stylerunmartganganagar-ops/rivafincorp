import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/lib/supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Create a short-lived signed URL for a private storage object
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresInSeconds = 60
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);
    if (error) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}
