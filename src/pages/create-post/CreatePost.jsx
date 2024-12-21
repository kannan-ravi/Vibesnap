import React, { useRef, useState } from "react";
import {
  FaArrowLeftLong,
  FaCamera,
  FaFolderOpen,
  FaImages,
  FaPause,
  FaPlay,
  FaTrash,
  FaViadeo,
  FaVideo,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import { storage } from "../../../appwrite";
import "swiper/css";
import { ID } from "appwrite";
import { db } from "../../../firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../constants/firebase-function";
import { toastError, toastSuccess } from "../../app/features/toastSlice";
import { editProfile } from "../../app/features/userSlice";

const CreatePost = () => {
  const navigate = useNavigate();
  const videoPreviewRef = useRef(null);
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSwiperIndex, setActiveSwiperIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { user } = useSelector((state) => state.user);

  const onContentChange = (e) => {
    setContent(e.target.value);
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    const preview = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles(files);
    setFilePreview(preview);
  };

  const handleDeleteSelectedFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreview = filePreview.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFilePreview(updatedPreview);
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

  const handleFileUpload = async (files) => {
    const uploadedFiles = [];
    try {
      for (const file of files) {
        const response = await storage.createFile(
          import.meta.env.VITE_APPWRITE_POST_BUCKET_ID,
          ID.unique(),
          file
        );
        uploadedFiles.push(
          `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${
            import.meta.env.VITE_APPWRITE_POST_BUCKET_ID
          }/files/${response.$id}/view?project=${
            import.meta.env.VITE_APPWRITE_PROJECT_ID
          }`
        );
      }
      return uploadedFiles;
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const extractHashTagsFromContent = (content) => {
    const regex = /#(\w+)/g;
    const hashTags = [];
    let match;
    while ((match = regex.exec(content))) {
      hashTags.push(match[1]);
    }
    return hashTags;
  };

  const extractContenWithoutHashtags = (content) => {
    const extractedContent = content.replace(/#(\w+)/g, "").trim();
    return extractedContent;
  };

  const updateUserWithPostRef = async (postID) => {
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        posts: arrayUnion(doc(db, `posts/${postID}`)),
      });

      const fieldsToExtract = [
        "files_url",
        "descripton",
        "files_type",
        "total_likes",
      ];
      const newPost = await getPosts([postID], fieldsToExtract);
      dispatch(editProfile({ ...user, posts: [...user.posts, ...newPost] }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    if (content && selectedFiles.length > 0) {
      try {
        const uploadedFiles = await handleFileUpload(selectedFiles);
        if (uploadedFiles.length > 0) {
          const post = {
            created_at: serverTimestamp(),
            descripton: extractContenWithoutHashtags(content),
            files_type: selectedFiles[0]?.type.startsWith("video")
              ? "videos"
              : "photos",
            files_url: uploadedFiles,
            hash_tags: extractHashTagsFromContent(content),
            posted_by: doc(db, `users/${user.uid}`),
            total_likes: 0,
          };
          const docRef = await addDoc(collection(db, "posts"), post);

          updateUserWithPostRef(docRef.id);
          dispatch(toastSuccess("Post created successfully"));
          navigate("/");
        }
      } catch (error) {
        console.log("Error uploading file:", error);
        dispatch(toastError("Error creating post"));
      } finally {
        setIsUploading(false);
      }
    } else {
      setIsUploading(false);
      dispatch(toastError("Please add content and select a file"));
    }
  };

  return (
    <div className="relative px-4 pb-36 pt-7">
      <div className="flex items-center justify-start gap-6">
        <FaArrowLeftLong
          className="text-lg cursor-pointer"
          onClick={() => navigate(-1)}
        />

        <h1 className="text-xl font-bold">New Post</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {filePreview.length > 0 && (
          <div className="flex items-center justify-start gap-4 px-4 mt-8 mb-4">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              onSlideChange={(swiper) =>
                setActiveSwiperIndex(swiper.activeIndex)
              }
            >
              <p className="absolute z-10 px-3 py-0 font-semibold tracking-widest bg-white top-4 right-4 rounded-3xl">
                {activeSwiperIndex + 1 + "/" + filePreview.length}
              </p>
              {selectedFiles.map((file, index) => (
                <SwiperSlide key={index}>
                  {file.type.startsWith("image") ? (
                    <img
                      src={filePreview[index]}
                      alt={`Post image ${index + 1}`}
                      className="object-cover w-full rounded-lg h-80"
                    />
                  ) : file.type.startsWith("video") ? (
                    <div className="relative">
                      <video
                        src={filePreview[index]}
                        controls={false}
                        id="video-preview"
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
                  <div
                    className="p-2 bg-[rgba(0,0,0,0.5)] absolute z-10 bottom-4 right-4 rounded-full"
                    onClick={() => handleDeleteSelectedFile(index)}
                  >
                    <FaTrash className="text-white" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        <textarea
          id="whats-on-your-mind"
          className="w-full p-4 mt-4 font-medium rounded outline-none bg-slate-100 placeholder:font-normal"
          placeholder="What's on your mind?"
          rows={6}
          value={content}
          onChange={onContentChange}
        ></textarea>
        <div className="mt-2">
          <label
            className="flex items-center justify-start gap-3 p-1 cursor-pointer"
            htmlFor="images"
          >
            <FaImages className="text-lg text-green-500" />
            <input
              type="file"
              name="images"
              id="images"
              className="hidden"
              accept="image/*"
              onChange={onFileChange}
              multiple
            />
            <p className="font-semibold">Photos</p>
          </label>
          <label className="flex items-center justify-start gap-3 p-1 cursor-pointer">
            <FaVideo className="text-lg text-rose-500" />
            <input
              type="file"
              name="videos"
              id="videos"
              className="hidden"
              accept="video/*"
              onChange={onFileChange}
            />
            <p className="font-semibold">Videos</p>
          </label>
          <div className="flex items-center justify-start gap-3 p-1">
            <FaCamera className="text-lg text-blue-500" />
            <p className="font-semibold">Camera</p>
          </div>
        </div>

        <div className="fixed left-0 flex justify-center w-full px-4 bottom-5">
          <button
            type="submit"
            disabled={isUploading}
            className="w-full max-w-md py-3 font-medium text-center text-white uppercase bg-black border rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="mr-2 animate-spin"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                </svg>
                loading
              </span>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
