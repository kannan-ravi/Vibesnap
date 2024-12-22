import React, { useRef, useState } from "react";
import { FaHeart, FaPause, FaPlay } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";

const ProfileMyPostsCard = ({ post }) => {
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
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      onSlideChange={(swiper) => setActiveSwiperIndex(swiper.activeIndex)}
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
  );
};

export default ProfileMyPostsCard;
