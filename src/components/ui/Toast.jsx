import { useEffect } from "react";
import { MdError, MdCheckCircle, MdCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "../../app/features/toastSlice";

const Toast = () => {
  const { isToastVisible, toastMessage, isToastSuccess, isToastError } =
    useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    let timeoutId;

    if (isToastVisible) {
      timeoutId = setTimeout(() => {
        dispatch(removeToast());
      }, 5000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isToastVisible, dispatch]);

  return (
    <div
      className={`fixed left-2/4 -translate-x-2/4 min-w-60 duration-200 z-20 ${
        isToastVisible ? "top-6" : "-top-10"
      } ${isToastError ? "bg-red-600" : "bg-green-600"}`}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <div className="flex items-center">
          {isToastError ? (
            <MdError className="mr-3 text-slate-100" />
          ) : isToastSuccess ? (
            <MdCheckCircle className="mr-3 text-slate-100" />
          ) : null}
          <p className="font-semibold text-slate-100">{toastMessage}</p>
        </div>
        <MdCancel
          onClick={() => dispatch(removeToast())}
          type="button"
          className={`cursor-pointer text-slate-100`}
        />
      </div>
    </div>
  );
};

export default Toast;
