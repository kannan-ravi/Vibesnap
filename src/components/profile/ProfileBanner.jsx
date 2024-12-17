import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const ProfileBanner = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-no-repeat bg-cover min-h-48 bg-profile-banner"></div>
      <FaArrowLeftLong
        className="absolute text-lg text-white cursor-pointer top-5 left-5"
        onClick={() => navigate(-1)}
      />
    </>
  );
};

export default ProfileBanner;
