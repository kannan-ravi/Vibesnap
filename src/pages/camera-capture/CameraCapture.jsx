import { useRef, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ImageCapture from "../../components/camera-capture/ImageCapture";
import { MdKeyboardBackspace } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
import { setImageSource } from "../../app/features/miscellaneousSlice";
import Webcam from "react-webcam";

export default function CameraCapture() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { imageSource } = useSelector((state) => state.miscellaneous);

  const webcamRef = useRef(null);
  const [cameraBlocked, setCameraBlocked] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    dispatch(setImageSource(imageSrc));
  }, [webcamRef]);

  const handleGoBack = () => {
    dispatch(setImageSource(""));
    navigate(-1);
  };

  useEffect(() => {
    const checkCameraAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraBlocked(false);
      } catch (error) {
        console.error("Camera access blocked:", error);
        setCameraBlocked(true);
      }
    };

    checkCameraAccess();

    return () => {
      dispatch(setImageSource(""));
    };
  }, []);

  return (
    <div className="relative">
      <MdKeyboardBackspace
        className="cursor-pointer absolute top-[4%] left-[2%] text-red text-4xl z-10"
        onClick={handleGoBack}
      />

      {!imageSource && !cameraBlocked && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Webcam
            ref={webcamRef}
            audio={false}
            width={"100%"}
            height={"100vh"}
            screenshotFormat="image/jpeg"
            videoConstraints="environment"
          />
          <button className="fixed flex items-center justify-center p-5 transform -translate-x-1/2 bg-white border-0 rounded-full bottom-10 left-1/2">
            <FaCamera className="text-4xl" onClick={capture} />
          </button>
        </div>
      )}

      {cameraBlocked && (
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-2xl text-red-500">Camera access blocked!</h1>
        </div>
      )}

      {imageSource && !cameraBlocked && <ImageCapture />}
    </div>
  );
}
