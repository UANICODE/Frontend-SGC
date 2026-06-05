import { supabase } from "@/lib/supabase";

export async function uploadProductImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/"))
    throw new Error("Apenas imagens permitidas");

  if (file.size > 5 * 1024 * 1024)
    throw new Error("Máximo 5MB");

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
    .getPublicUrl(fileName);

  return data.publicUrl;
}