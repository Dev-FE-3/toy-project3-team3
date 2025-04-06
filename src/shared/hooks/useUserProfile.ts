// useProfileImage.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DefaultProfile from "@/assets/images/defaultProfile.svg";

const useProfileImage = () => {
  const [profileImage, setProfileImage] = useState<string>(DefaultProfile);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;
      setUser({ id: data.user.id, email: data.user.email ?? undefined });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      if (!user) return;

      const { data: list, error } = await supabase.storage
        .from("profiles")
        .list();

      if (error || !list) return;

      const file = list.find((f) => f.name.startsWith(user.id));
      if (!file) return setProfileImage(DefaultProfile);

      const { data } = supabase.storage
        .from("profiles")
        .getPublicUrl(file.name);

      if (data?.publicUrl) {
        setProfileImage(data.publicUrl);
      } else {
        setProfileImage(DefaultProfile);
      }
    };

    fetchImage();
  }, [user]);

  return { profileImage, user, refetchImage: () => window.location.reload() };
};

export default useProfileImage;
