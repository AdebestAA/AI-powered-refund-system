import axios from "axios";
import toast from "react-hot-toast";

export const handleError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    toast.error(
      err.response?.data?.message || err.response?.data.msg || "Network error",
    );
  } else if (err instanceof Error) {
    toast.error(err.message);
  } else {
    toast.error("Something went wrong");
  }
};
