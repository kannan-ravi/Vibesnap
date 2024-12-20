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

const EditProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      <ProfileBanner />

      <div className="h-full px-4">
        <div className="flex items-end justify-start gap-7 -translate-y-2/4">
          <div className="relative">
            <img
              src={user.photoURL ? user.photoURL : DEFAULT_AVATAR}
              alt={
                user.displayName ? user.displayName + " Image" : "User Image"
              }
              className="rounded-full w-28 h-28"
            />
            <div className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-gray-50 w-9 h-9">
              <FaPencil />
            </div>
          </div>
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
