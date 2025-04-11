import { Navigate } from "react-router-dom";
import useUser from "@/shared/hooks/useUser";

const NavigateToMyStorage = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return null; // or Loading spinner

  return <Navigate to={`/storage/${user?.random_id}`} />;
};

export default NavigateToMyStorage;
