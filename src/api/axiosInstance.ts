import axios from "axios"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const axiosInstance =  axios.create({
  baseURL: `${supabaseUrl}/rest/v1`, // Supabase REST API 엔드포인트 Supabase REST API는 /rest/v1 경로를 통해 데이터베이스에 접근
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation', // Supabase에 데이터를 insert/update한 후 결과 데이터를 응답으로 받고 싶을 때 사용
  },
})

export default axiosInstance