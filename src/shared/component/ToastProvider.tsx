import { ToastContainer } from "react-toastify";

const ToastProvider = () => {
  return <ToastContainer autoClose={3000} position="top-center" />;
};

export default ToastProvider;
