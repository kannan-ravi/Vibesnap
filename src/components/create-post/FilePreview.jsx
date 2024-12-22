import { FaPause, FaPlay, FaTrash } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { handlePlayClick } from "../../utils/functions";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

const FilePreview = ({
  selectedFiles,
  filePreview,
  handleDeleteSelectedFile,
}) => {
  const { capturedImage } = useSelector((state) => state.miscellaneous);
  const [activeSwiperIndex, setActiveSwiperIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoPreviewRef = useRef(null);
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      onSlideChange={(swiper) => setActiveSwiperIndex(swiper.activeIndex)}
    >
      <p className="absolute z-10 px-3 py-0 font-semibold tracking-widest bg-white top-4 right-4 rounded-3xl">
        {activeSwiperIndex + 1 + "/" + filePreview.length}
      </p>
      {selectedFiles.map((file, index) => (
        <SwiperSlide key={index}>
          {file?.type?.startsWith("image") ? (
            <img
              src={filePreview[index]}
              alt={`Post image ${index + 1}`}
              className="object-cover w-full rounded-lg h-80"
            />
          ) : file?.type?.startsWith("video") ? (
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
                onClick={() =>
                  handlePlayClick(videoPreviewRef, isPlaying, setIsPlaying)
                }
              >
                {isPlaying ? (
                  <FaPause className="text-2xl text-white" />
                ) : (
                  <FaPlay className="text-2xl text-white" />
                )}
              </div>
            </div>
          ) : (
            <img
              src={filePreview[index]}
              alt={`Post image ${index + 1}`}
              className="object-cover w-full rounded-lg h-80 max-h-80"
            />
          )}
          <div
            className="p-2 bg-[rgba(0,0,0,0.5)] absolute z-10 bottom-4 right-4 rounded-full"
            onClick={() => handleDeleteSelectedFile(index)}
          >
            <FaTrash className="text-white" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default FilePreview;
