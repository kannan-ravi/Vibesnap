import React, { useState } from "react";
import {
  FaArrowLeftLong,
  FaCamera,
  FaFolderOpen,
  FaImages,
  FaVideo,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  const onContentChange = (e) => {};
  const handleSubmit = (e) => {};

  return (
    <div className="relative px-4 py-7">
      <div className="flex items-center justify-start gap-6">
        <FaArrowLeftLong className="text-lg cursor-pointer" onClick={() => navigate(-1)} />

        <h1 className="text-xl font-bold">New Post</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          id="whats-on-your-mind"
          className="w-full p-4 mt-4 font-medium rounded outline-none bg-slate-100 placeholder:font-normal"
          placeholder="What's on your mind?"
          rows={6}
          value={content}
          onChange={onContentChange}
        ></textarea>
        <div className="mt-2">
          <div className="flex items-center justify-start gap-3 p-1">
            <FaImages className="text-lg text-green-500" />
            <p className="font-semibold">Photos</p>
          </div>
          <div className="flex items-center justify-start gap-3 p-1">
            <FaVideo className="text-lg text-rose-500" />
            <p className="font-semibold">Videos</p>
          </div>
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
