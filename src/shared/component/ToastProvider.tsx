import { ToastContainer } from "react-toastify";

const ToastProvider = () => {
  return <ToastContainer autoClose={2000} position="top-center" />;
};

export default ToastProvider;
