import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DEFAULT_AVATAR } from "../../constants/default-value";

const FeedsHeader = () => {
  const { user } = useSelector((state) => state.user);
  return (
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
  );
};

export default FeedsHeader;
