import React, { useState } from "react";
import ProfileBanner from "../../../components/profile/ProfileBanner";
import { FaPencil } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { editProfile } from "../../../app/features/userSlice";
import { useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR } from "../../../constants/default-value";
import { toastSuccess } from "../../../app/features/toastSlice";
import { storage } from "../../../../appwrite";
import { ID } from "appwrite";

const EditProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileImageUploading, setIsProfileImageUploading] = useState(false);
  const [editUser, setEditUser] = useState({
    name: user.displayName,
    bio: user.bio,
  });

  const onChange = (e) => {
    setEditUser({
      ...editUser,
      [e.target.id]: e.target.value,
    });
  };

  const handleChangeProfilePicture = async (e) => {
    try {
      setIsProfileImageUploading(true);
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
        photoURL: fileUrl,
      });

      dispatch(editProfile({ ...user, photoURL: fileUrl }));
      dispatch(toastSuccess("Profile picture updated"));
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsProfileImageUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, editUser);
      dispatch(editProfile(editUser));
      dispatch(toastSuccess("Profile updated"));
      navigate("/profile");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="relative">
      <ProfileBanner editable={true} />

      <div className="h-full px-4">
        <div className="flex items-end justify-start gap-7 -translate-y-2/4">
          <label className="relative cursor-pointer" htmlFor="profile-picture">
            {isProfileImageUploading && (
              <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-opacity-50 rounded-full bg-gray-50">
                <div className="w-6 h-6 border-2 border-t-2 border-black animate-spin"></div>
              </div>
            )}
            <img
              src={user.photoURL ? user.photoURL : DEFAULT_AVATAR}
              alt={
                user.displayName ? user.displayName + " Image" : "User Image"
              }
              className="object-cover rounded-full w-28 h-28"
            />
            <input
              type="file"
              id="profile-picture"
              className="hidden"
              onChange={handleChangeProfilePicture}
            />
            <div className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-gray-50 w-9 h-9">
              <FaPencil />
            </div>
          </label>
        </div>

        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="w-full py-1 font-medium border-0 border-b-2 outline-none"
              value={editUser.name}
              onChange={onChange}
            />
          </div>
          <div className="mt-5">
            <label htmlFor="name">Bio</label>
            <textarea
              id="bio"
              className="w-full py-1 font-medium border-0 border-b-2 outline-none"
              value={editUser.bio}
              onChange={onChange}
            ></textarea>
          </div>

          <div className="fixed left-0 flex justify-center w-full px-4 bottom-5">
            <button
              type="submit"
              className="w-full max-w-md py-3 font-medium text-center text-white uppercase bg-black border rounded-full"
            >
              save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
