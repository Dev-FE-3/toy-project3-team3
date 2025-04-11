import axiosInstance from "@/api/axiosInstance";
import { User } from "@/api/users";

export async function getUserByRandomId(
  randomId: number,
): Promise<User | null> {
  const response = await axiosInstance.get<User[]>(
    `/user_table?random_id=eq.${randomId}`,
  );

  return response.data.length > 0 ? response.data[0] : null;
}
