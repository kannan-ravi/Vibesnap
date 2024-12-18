import React from "react";
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

const FeedsSharePopup = ({ isSharePopupActive, setIsSharePopupActive }) => {
  return (
    <div
      className={`absolute ${
        isSharePopupActive ? "block" : "hidden"
      } left-0 top-0 w-full h-full min-h-screen bg-[rgba(0,0,0,0.5)] z-10 flex items-center justify-center px-4`}
    >
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
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-4 bg-blue-100 rounded-full cursor-pointer">
                <FaTwitter className="text-3xl text-blue-400" />
              </div>
              <p className="text-sm">Twitter</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-4 bg-blue-100 rounded-full cursor-pointer">
                <FaFacebook className="text-3xl text-blue-500" />
              </div>
              <p className="text-sm">Facebook</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-4 bg-red-100 rounded-full cursor-pointer">
                <FaRedditAlien className="text-3xl text-red-500" />
              </div>
              <p className="text-sm">Reddit</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-4 rounded-full cursor-pointer bg-violet-100">
                <FaDiscord className="text-3xl text-violet-500" />
              </div>
              <p className="text-sm">Discord</p>
            </div>
          </div>
          <div className="items-center justify-between gap-4 mt-8 columns-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-4 bg-green-100 rounded-full cursor-pointer">
                <TbBrandWhatsappFilled className="text-3xl text-green-400" />
              </div>
              <p className="text-sm">Whatsapp</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-4 bg-blue-100 rounded-full cursor-pointer">
                <FaFacebookMessenger className="text-3xl text-blue-500" />
              </div>
              <p className="text-sm">Messenger</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-4 bg-blue-100 rounded-full cursor-pointer">
                <FaTelegramPlane className="text-3xl text-blue-600" />
              </div>
              <p className="text-sm">Telegram</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-4 bg-orange-100 rounded-full cursor-pointer">
                <FaInstagramSquare className="text-3xl text-orange-500" />
              </div>
              <p className="text-sm">Instagram</p>
            </div>
          </div>
        </div>

        <div className="py-6">
          <h2 className="text-xl font-semibold">Page Link</h2>
          <div className="flex items-center gap-2 px-3 py-3 mt-4 rounded bg-slate-200">
            <input
              type="text"
              className="w-full border rounded-2xl text-slate-400 bg-slate-200"
              value="http://localhost:3000"
              readOnly
            />
            <FaCopy className="text-lg cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedsSharePopup;
