import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProfileBanner from "../../components/profile/ProfileBanner";
import { useSelector } from "react-redux";
import { DEFAULT_AVATAR } from "../../constants/default-value";

import { Swiper, SwiperSlide } from "swiper/react";
import { FaHeart } from "react-icons/fa";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [activeSwiperIndex, setActiveSwiperIndex] = useState(0);

  return (
    <div className="relative">
      <ProfileBanner />
      <div className="px-4">
        <div className="flex items-end justify-start gap-7 -translate-y-2/4">
          <img
            src={user.photoURL ? user.photoURL : DEFAULT_AVATAR}
            alt=""
            className="rounded-full w-28 h-28"
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
          <div className="gap-4 pt-4 pb-10 columns-2">
            {user.posts.map((post) => (
              <div className="border">
                <Swiper
                  spaceBetween={20}
                  slidesPerView={1}
                  onSlideChange={(swiper) =>
                    setActiveSwiperIndex(swiper.activeIndex)
                  }
                >
                  <p className="absolute z-10 px-3 py-0 font-semibold tracking-widest bg-white top-4 right-4 rounded-3xl">
                    {post.files_url.length + "/" + (activeSwiperIndex + 1)}
                  </p>
                  {post.files_url.map((file_url, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={file_url}
                        alt=""
                        className="object-cover w-full h-full rounded-lg max-h-72 min-h-72"
                      />
                    </SwiperSlide>
                  ))}
                  <div className="absolute bottom-0 z-10 p-4">
                    <p className="text-sm text-gray-50">
                      {post?.descripton?.length > 20
                        ? post?.descripton?.substring(0, 20) + "..."
                        : post?.descripton}
                    </p>
                    <div className="flex items-center justify-start gap-2 mt-2">
                      <FaHeart className="text-red-500" />
                      <p className="text-gray-50">{post.total_likes}</p>
                    </div>
                  </div>
                </Swiper>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
