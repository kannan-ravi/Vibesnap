import React, { useRef, useState } from "react";
import { FaHeart, FaLocationArrow } from "react-icons/fa";
import { DEFAULT_AVATAR } from "../../constants/default-value";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import {
  decreasePostTotalLike,
  increasePostTotalLike,
} from "../../app/features/postSlice";
import { addLikedPost, removeLikedPost } from "../../app/features/userSlice";
import FeedsSharePopup from "./FeedsSharePopup";
import { toastSuccess } from "../../app/features/toastSlice";
import { FaPause, FaPlay } from "react-icons/fa6";

const FeedsCard = ({ data }) => {
  const dispatch = useDispatch();
  const videoPreviewRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const [activeSwiperIndex, setActiveSwiperIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSharePopupActive, setIsSharePopupActive] = useState(false);

  const isPostLikedByUser = (user_liked_posts) => {
    return user_liked_posts.includes(data.id);
  };

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

  const handlePostLiked = async () => {
    try {
      const postDocRef = doc(db, "posts", data.id);
      const userDocRef = doc(db, "users", user.uid);
      if (isPostLikedByUser(user.liked_posts)) {
        await updateDoc(userDocRef, {
          liked_posts: arrayRemove(doc(db, `posts/${data.id}`)),
        });
        await updateDoc(postDocRef, { total_likes: increment(-1) });
        dispatch(decreasePostTotalLike(data.id));
        dispatch(removeLikedPost(data.id));
        dispatch(toastSuccess("Post Unliked"));
      } else {
        await updateDoc(userDocRef, {
          liked_posts: arrayUnion(doc(db, `posts/${data.id}`)),
        });
        await updateDoc(postDocRef, { total_likes: increment(1) });
        dispatch(increasePostTotalLike(data.id));
        dispatch(addLikedPost(data.id));
        dispatch(toastSuccess("Post Liked"));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePostedAgo = (timestamp) => {
    const now = new Date().getTime();
    const diff = now - timestamp * 1000;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months > 0 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 0 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 0 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 0 ? "s" : ""} ago`;
    } else if (seconds > 0) {
      return `${seconds} second${seconds > 0 ? "s" : ""} ago`;
    }
  };

  return (
    <>
      <div className="p-3 bg-pink-50 rounded-2xl">
        <div className="flex items-center justify-start gap-4">
          <img
            src={
              data.posted_by.photoURL ? data.posted_by.photoURL : DEFAULT_AVATAR
            }
            alt={
              data.posted_by.displayName
                ? data.posted_by.displayName
                : "User Image"
            }
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{data.posted_by.displayName}</p>
            <p className="text-sm text-gray-500">
              {handlePostedAgo(data.created_at.seconds)}
            </p>
          </div>
        </div>

        <p className="mt-5">
          {`${data.descripton} `}
          {data.hash_tags.map((tag, index) => (
            <span key={index} className="text-blue-500">{`#${tag} `}</span>
          ))}
        </p>

        <div className="mt-5">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            onSlideChange={(swiper) => setActiveSwiperIndex(swiper.activeIndex)}
          >
            <p className="absolute z-10 px-3 py-0 font-semibold tracking-widest bg-white top-4 right-4 rounded-3xl">
              {activeSwiperIndex + 1 + "/" + data.files_url.length}
            </p>
            {data.files_url.map((file_url, index) => (
              <SwiperSlide key={index}>
                {data.files_type === "photos" ? (
                  <img
                    src={file_url}
                    alt={`Post image ${index + 1}`}
                    className="object-cover w-full rounded-lg max-h-72"
                  />
                ) : data.files_type === "videos" ? (
                  <div className="relative">
                    <video
                      src={file_url}
                      controls={false}
                      ref={videoPreviewRef}
                      className="object-cover w-full rounded-lg max-h-72"
                    />
                    <div
                      className="absolute z-10 top-1/2 left-1/2 p-3 bg-[rgba(0,0,0,0.5)] rounded-full -translate-y-1/2 -translate-x-1/2"
                      onClick={handlePlayClick}
                    >
                      {isPlaying ? (
                        <FaPause className="text-2xl text-white" />
                      ) : (
                        <FaPlay className="text-2xl text-white" />
                      )}
                    </div>
                  </div>
                ) : null}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center justify-start gap-2">
            <FaHeart
              onClick={handlePostLiked}
              aria-label="Like this post"
              role="button"
              className={`${
                isPostLikedByUser(user.liked_posts)
                  ? "text-red-500"
                  : "text-gray-500"
              } cursor-pointer`}
            />

            <p>{data.total_likes}</p>
          </div>
          <div
            className="flex items-center justify-start gap-2 px-4 py-2 bg-pink-100 rounded-full cursor-pointer"
            aria-label="Share this post"
            role="button"
            onClick={() => setIsSharePopupActive(true)}
          >
            <FaLocationArrow />
            <p>Share</p>
          </div>
        </div>
      </div>

      <FeedsSharePopup
        isSharePopupActive={isSharePopupActive}
        setIsSharePopupActive={setIsSharePopupActive}
      />
    </>
  );
};

export default FeedsCard;
