import React from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  setCapturedImage,
  setImageSource,
} from "../../app/features/miscellaneousSlice";
import { useNavigate } from "react-router-dom";

export default function ImageCapture() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { imageSource } = useSelector((state) => state.miscellaneous);
  const handleReTakePhoto = () => {
    dispatch(setImageSource(""));
  };

  const handleSelectCapturedPhoto = () => {
    dispatch(setCapturedImage(imageSource));
    dispatch(setImageSource(""));
    navigate("/create-post");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <img src={imageSource} alt="webcam" className="w-full" />
      <div className="absolute left-0 flex items-center justify-between w-full px-10 transition-all duration-300 ease-in-out bottom-8">
        <button
          className="flex items-center justify-center w-20 h-20 bg-red-500 border-none rounded-full cursor-pointer"
          onClick={handleReTakePhoto}
        >
          <FaXmark className="text-4xl text-white" />
        </button>
        <button
          className="flex items-center justify-center w-20 h-20 bg-green-500 border-none rounded-full cursor-pointer"
          onClick={handleSelectCapturedPhoto}
        >
          <FaCheck className="text-4xl text-white" />
        </button>
      </div>
    </div>
  );
}
