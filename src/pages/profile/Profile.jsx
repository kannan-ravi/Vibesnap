import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProfileBanner from "../../components/profile/ProfileBanner";
import { useSelector } from "react-redux";
import { DEFAULT_AVATAR } from "../../constants/default-value";

import { Swiper, SwiperSlide } from "swiper/react";
import { FaHeart } from "react-icons/fa";
import { FaPause, FaPlay } from "react-icons/fa6";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const videoPreviewRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSwiperIndex, setActiveSwiperIndex] = useState(0);

  const handlePlayClick = () => {
    if (videoPreviewRef.current) {
      if (isPlaying) {
        videoPreviewRef.current.pause();
      } else {
        videoPreviewRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={1}
                    onSlideChange={(swiper) =>
                      setActiveSwiperIndex(swiper.activeIndex)
                    }
                  >
                    <p className="absolute z-10 px-3 py-0 font-semibold tracking-widest bg-white top-4 right-4 rounded-3xl">
                      {activeSwiperIndex + 1 + "/" + post.files_url.length}
                    </p>
                    {post.files_url.map((file_url, fileIndex) => (
                      <SwiperSlide key={fileIndex}>
                        {post.files_type === "photos" ? (
                          <img
                            src={file_url}
                            alt=""
                            className="object-cover w-full h-full rounded-lg max-h-72 min-h-72"
                          />
                        ) : post.files_type === "videos" ? (
                          <div className="relative">
                            <video
                              src={file_url}
                              controls={false}
                              ref={videoPreviewRef}
                              className="object-cover w-full rounded-lg max-h-72"
                            />
                            <div
                              className="absolute z-20 top-1/2 left-1/2 p-3 bg-[rgba(0,0,0,0.5)] rounded-full -translate-y-1/2 -translate-x-1/2"
                              onClick={handlePlayClick}
                            >
                              {isPlaying ? (
                                <FaPause className="text-2xl text-white cursor-pointer" />
                              ) : (
                                <FaPlay className="text-2xl text-white cursor-pointer" />
                              )}
                            </div>
                          </div>
                        ) : null}
                      </SwiperSlide>
                    ))}
                    <div className="absolute bottom-0 z-10 p-4">
                      <p className="text-sm text-gray-50">
                        {post?.descripton?.length > 20
                          ? post?.descripton?.substring(0, 20) + "..."
                          : post?.descripton}
                      </p>
                      <div className="flex items-center justify-start gap-2 mt-2">
                        <FaHeart className="text-slate-300" />
                        <p className="text-gray-50">{post.total_likes}</p>
                      </div>
                    </div>
                  </Swiper>
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
