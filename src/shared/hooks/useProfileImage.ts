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
      setUser({
        id: data.user.id,
        email: data.user.email ?? undefined,
      });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchProfileImage = async () => {
      const { data: fileList, error } = await supabase.storage
        .from("profiles")
        .list("profiles", { search: `${user.id}.png` });

      if (error || fileList.length === 0) {
        setProfileImage(DefaultProfile);
        return;
      }

      const { data } = supabase.storage
        .from("profiles")
        .getPublicUrl(`profiles/${user.id}.png`);

      setProfileImage(data.publicUrl);
    };

    fetchProfileImage();
  }, [user]);

  return { profileImage, user };
};

export default useProfileImage;
