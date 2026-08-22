// Lost and Found items management API
import { supabase } from "@/lib/Server/supabase";
import { performMutation } from "@/lib/Server/baseApi";
import { deleteImage } from "@/lib/Server/storage";

// Register a newly found lost item
export const postLostItem = async (item: { name: string; place: string; photo_path?: string }) => {
  return performMutation(async () => {
    console.log("[API] Update Sent: New Lost Item");
    const { error } = await supabase.from("lost_items").insert([item]);
    if (error) throw error;
    return { success: true };
  });
};

// Edit details of a registered lost item with edit reason timestamp
export const updateLostItem = async (id: string, updates: { name: string; place: string; reason: string; photo_path?: string }) => {
  return performMutation(async () => {
    console.log(`[API] Update Sent: Edit Lost Item (${id})`);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const { error } = await supabase
      .from("lost_items")
      .update({
        name: updates.name,
        place: updates.place,
        photo_path: updates.photo_path,
        edit_reason: `${updates.reason} (${timeStr})`,
      })
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  });
};

// Delete a lost item record and remove its photo from storage if exists
export const deleteLostItem = async (id: string, photoPath?: string) => {
  return performMutation(async () => {
    if (photoPath) {
      try {
        await deleteImage(photoPath);
      } catch (e) {
        console.warn("[API] Storage deletion failed:", e);
      }
    }
    const { error } = await supabase.from("lost_items").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  });
};

