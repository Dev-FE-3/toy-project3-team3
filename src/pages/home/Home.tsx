import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase.ts";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("로그아웃 실패:", error.message);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <h1>Home</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </>
  );
};

export default Home;
