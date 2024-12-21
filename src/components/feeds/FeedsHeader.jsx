import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR } from "../../constants/default-value";
import { FaSignOutAlt } from "react-icons/fa";
import { auth } from "../../../firebase";
import { toastError, toastSuccess } from "../../app/features/toastSlice";
import { removeUser } from "../../app/features/userSlice";
import { removeAllPost } from "../../app/features/postSlice";

const FeedsHeader = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
      dispatch(removeUser());
      dispatch(removeAllPost());
      dispatch(toastSuccess("Logout successfully"));
    } catch (error) {
      console.error(error);
      dispatch(toastError("Logout failed"));
    }
  };
  return (
    <div className="flex items-center justify-between gap-4">
      <Link to="/profile" className="flex items-center justify-start gap-4">
        <img
          src={user.photoURL ? user.photoURL : DEFAULT_AVATAR}
          alt=""
          className="object-cover w-12 h-12 rounded-full"
        />
        <div className="">
          <p className="text-sm text-gray-500">Welcome Back,</p>
          <p className="text-lg font-semibold">{user.displayName}</p>
        </div>
      </Link>

      <FaSignOutAlt onClick={handleLogout} className="text-2xl" />
    </div>
  );
};

export default FeedsHeader;
