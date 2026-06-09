import { useDispatch, useSelector } from "react-redux";
import { removeError } from "../store/features/errorSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ErrorHandler = () => {
  const { message } = useSelector((state) => state.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      toast.error(message);
      dispatch(removeError());
    }
  }, [message, dispatch]);

  return null;
};

export default ErrorHandler;
