import React, { useRef } from "react";
import {
  FaCopy,
  FaDiscord,
  FaFacebook,
  FaFacebookMessenger,
  FaInstagramSquare,
  FaRedditAlien,
  FaTelegramPlane,
  FaTwitter,
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import { ENVIRONMENT } from "../../constants/environment";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toastSuccess } from "../../app/features/toastSlice";

const FeedsSharePopup = ({ isSharePopupActive, setIsSharePopupActive }) => {
  const copyInput = useRef(null);
  const dispatch = useDispatch();
  const handleCopyToClipboard = () => {
    const value = copyInput.current.value;
    navigator.clipboard
      .writeText(value)
      .then(() => dispatch(toastSuccess("Copied to clipboard")))
      .catch(() => dispatch(toastSuccess("Failed to copy to clipboard")));
    setIsSharePopupActive(false);
  };
  return (
    <div
      className={`fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full ${
        isSharePopupActive ? "block" : "hidden"
      }`}
    >
      <div className="w-full h-full min-h-screen bg-[rgba(0,0,0,0.5)] z-10 flex items-center justify-center px-4 max-w-md">
        <div className="w-full p-4 bg-white rounded">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Share Post</h1>
            <div
              className="p-2 rounded-full cursor-pointer bg-slate-200"
              onClick={() => setIsSharePopupActive(false)}
            >
              <FaXmark className="text-xl" />
            </div>
          </div>

          <div className="pt-10 pb-6">
            <div className="items-center justify-between gap-4 columns-4">
              <Link
                to={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  ENVIRONMENT.URL
                )}&text=${encodeURIComponent("Look What I Found!")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="p-4 bg-blue-100 rounded-full cursor-pointer">
                  <FaTwitter className="text-3xl text-blue-400" />
                </div>
                <p className="text-sm">Twitter</p>
              </Link>
              <Link
                to={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  ENVIRONMENT.URL
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="p-4 bg-blue-100 rounded-full cursor-pointer">
                  <FaFacebook className="text-3xl text-blue-500" />
                </div>
                <p className="text-sm">Facebook</p>
              </Link>
              <Link
                to={`https://www.reddit.com/submit?url=${encodeURIComponent(
                  ENVIRONMENT.URL
                )}&title=${encodeURIComponent("Look What I Found!")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="p-4 bg-red-100 rounded-full cursor-pointer">
                  <FaRedditAlien className="text-3xl text-red-500" />
                </div>
                <p className="text-sm">Reddit</p>
              </Link>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                to={`https://discord.com/channels/@me/0?text=${encodeURIComponent(
                  "Look What I Found!"
                )}%20${encodeURIComponent(ENVIRONMENT.URL)}`}
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="p-4 rounded-full cursor-pointer bg-violet-100">
                  <FaDiscord className="text-3xl text-violet-500" />
                </div>
                <p className="text-sm">Discord</p>
              </Link>
            </div>
            <div className="items-center justify-between gap-4 mt-8 columns-4">
              <Link
                to={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  "Look What I Found!"
                )}%20${encodeURIComponent(ENVIRONMENT.URL)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="p-4 bg-green-100 rounded-full cursor-pointer">
                  <TbBrandWhatsappFilled className="text-3xl text-green-400" />
                </div>
                <p className="text-sm">Whatsapp</p>
              </Link>
              <Link
                to={`https://www.facebook.com/dialog/send?link=${encodeURIComponent(
                  ENVIRONMENT.URL
                )}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(
                  ENVIRONMENT.URL
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="p-4 bg-blue-100 rounded-full cursor-pointer">
                  <FaFacebookMessenger className="text-3xl text-blue-500" />
                </div>
                <p className="text-sm">Messenger</p>
              </Link>
              <Link
                to={`https://t.me/share/url?url=${encodeURIComponent(
                  ENVIRONMENT.URL
                )}&text=${encodeURIComponent("Look What I Found!")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="p-4 bg-blue-100 rounded-full cursor-pointer">
                  <FaTelegramPlane className="text-3xl text-blue-600" />
                </div>
                <p className="text-sm">Telegram</p>
              </Link>
              <Link
                to={`https://www.instagram.com/?url=${encodeURIComponent(
                  ENVIRONMENT.URL
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="p-4 bg-orange-100 rounded-full cursor-pointer">
                  <FaInstagramSquare className="text-3xl text-orange-500" />
                </div>
                <p className="text-sm">Instagram</p>
              </Link>
            </div>
          </div>

          <div className="py-6">
            <h2 className="text-xl font-semibold">Page Link</h2>
            <div className="flex items-center gap-2 px-3 py-3 mt-4 rounded bg-slate-200">
              <input
                type="text"
                className="w-full border outline-none rounded-2xl text-slate-400 bg-slate-200"
                ref={copyInput}
                value={`${ENVIRONMENT.URL}`}
                readOnly
              />
              <FaCopy
                className="text-lg cursor-pointer"
                onClick={handleCopyToClipboard}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedsSharePopup;
