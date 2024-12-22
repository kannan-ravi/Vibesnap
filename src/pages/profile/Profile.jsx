import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProfileBanner from "../../components/profile/ProfileBanner";
import { useSelector } from "react-redux";
import { DEFAULT_AVATAR } from "../../constants/default-value";

import { Swiper, SwiperSlide } from "swiper/react";
import { FaHeart } from "react-icons/fa";
import { FaPause, FaPlay } from "react-icons/fa6";
import ProfileMyPostsCard from "../../components/profile/ProfileMyPostsCard";

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="relative">
      <ProfileBanner />
      <div className="px-4">
        <div className="flex items-end justify-start gap-4 -translate-y-2/4">
          <img
            src={user.photoURL ? user.photoURL : DEFAULT_AVATAR}
            alt=""
            className="object-cover rounded-full min-w-28 min-h-28 max-w-28 max-h-28"
          />
          <Link
            to="/profile/edit-profile"
            className="w-full py-1 font-medium text-center border border-black rounded-full"
          >
            Edit Profile
          </Link>
        </div>

        <div className="-translate-y-1/3">
          <h3 className="text-2xl font-extrabold">{user.displayName}</h3>
          <p className="mt-2">{user.bio ? user.bio : "Add a bio"}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">My Posts</h3>
          {user?.posts?.length > 0 ? (
            <div className="gap-4 pt-4 pb-10 columns-2">
              {user.posts.map((post, index) => (
                <div className="pb-4 border" key={index}>
                  <ProfileMyPostsCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <p className="self-center w-full text-lg font-semibold text-center">
                No Posts Found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
