import React, { useState } from "react";
import { FaArrowLeftLong, FaPencil } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editProfile } from "../../app/features/userSlice";
import { toastSuccess } from "../../app/features/toastSlice";
import { storage } from "../../../appwrite";
import { ID } from "appwrite";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const ProfileBanner = ({ editable = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isProfileBannerUploading, setIsProfileBannerUploading] =
    useState(false);

  const handleChangeProfilePicture = async (e) => {
    try {
      setIsProfileBannerUploading(true);
      const response = await storage.createFile(
        import.meta.env.VITE_APPWRITE_USER_BUCKET_ID,
        ID.unique(),
        e.target.files[0]
      );

      const fileUrl = `${
        import.meta.env.VITE_APPWRITE_ENDPOINT
      }/storage/buckets/${import.meta.env.VITE_APPWRITE_USER_BUCKET_ID}/files/${
        response.$id
      }/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;

      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        banner_image: fileUrl,
      });

      dispatch(editProfile({ ...user, banner_image: fileUrl }));
      dispatch(toastSuccess("Profile banner updated"));
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsProfileBannerUploading(false);
    }
  };
  return (
    <>
      <div
        className="relative bg-no-repeat bg-cover min-h-48"
        style={{ backgroundImage: `url(${user?.banner_image})` }}
      >
        {isProfileBannerUploading && (
          <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-opacity-50 bg-gray-50">
            <div className="w-10 h-10 border-2 border-t-2 border-black animate-spin"></div>
          </div>
        )}
      </div>
      <FaArrowLeftLong
        className="absolute text-lg text-white cursor-pointer top-5 left-5"
        onClick={() => navigate(-1)}
      />
      {editable && (
        <label
          htmlFor="banner-image"
          className="absolute z-30 flex items-center justify-center rounded-full right-5 top-32 bg-gray-50 w-9 h-9"
        >
          <input
            type="file"
            onChange={handleChangeProfilePicture}
            className="hidden"
            id="banner-image"
          />
          <FaPencil />
        </label>
      )}
    </>
  );
};

export default ProfileBanner;
