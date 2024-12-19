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
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";

const CreatePost = () => {
  const navigate = useNavigate();
  const videoPreviewRef = useRef(null);
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSwiperIndex, setActiveSwiperIndex] = useState(0);

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
          `${import.meta.env.VITE_APPWRITE_ENDPOINT}/buckets/${
            import.meta.env.VITE_APPWRITE_POST_BUCKET_ID
          }/files/${response.$id}`
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("loading started");
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
          posted_by: `users/${user.uid}`,
          total_likes: 0,
        };
        const docRef = await addDoc(collection(db, "posts"), post);
        console.log("Document updated successfully", docRef);
        navigate("/");
      }
    } catch (error) {
      console.log("Error uploading file:", error);
    } finally {
      console.log("loading ended");
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
            className="w-full max-w-md py-3 font-medium text-center text-white uppercase bg-black border rounded-full"
          >
            save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
