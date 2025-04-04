import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.ts";
import type { User } from "@supabase/supabase-js";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error.message);
      }
      setUser(data?.user || null);
      setIsLoading(false);
    };

    checkUser();
  }, []);

  if (isLoading) return <div>로딩 중...</div>;

  return user ? children : <Navigate to="/login" />;
}
