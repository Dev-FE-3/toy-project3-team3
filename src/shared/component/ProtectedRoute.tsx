import { Navigate } from "react-router-dom";
import Loading from "@/shared/component/Loading";
import useUser from "@/shared/hooks/useUser";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, user } = useUser();

  if (isLoading) return <Loading />;

  // user가 없다는 건 로그인 안 된 상태
  return user ? children : <Navigate to="/login" />;
}
