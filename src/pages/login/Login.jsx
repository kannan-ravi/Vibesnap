import { FcGoogle } from "react-icons/fc";
import ImageO1 from "../../assets/login/image-01.png";
import ImageO2 from "../../assets/login/image-02.png";
import ImageO3 from "../../assets/login/image-03.png";
import ImageO4 from "../../assets/login/image-04.png";
import ImageO5 from "../../assets/login/image-05.png";
import ImageO6 from "../../assets/login/image-06.png";
import ImageO7 from "../../assets/login/image-07.png";

import { app, db } from "../../../firebase";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../../app/features/userSlice";
import { getPosts } from "../../constants/firebase-function";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginWithGoogleAuth = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        token: result.user.accessToken,
      };

      const userRef = doc(db, "users", userData.uid);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const existingUserData = userSnapshot.data();
        const fieldsToExtract = [
          "files_url",
          "descripton",
          "files_type",
          "total_likes",
        ];

        const postsRefs = existingUserData.posts.map((postRef) => postRef.id);
        const likedPostsRefs = existingUserData.liked_posts.map(
          (postRef) => postRef.id
        );

        const extractedPosts = await getPosts(postsRefs, fieldsToExtract);
        const extractedLikedPosts = await getPosts(likedPostsRefs);

        dispatch(
          addUser({
            ...existingUserData,
            liked_posts: extractedLikedPosts,
            posts: extractedPosts,
          })
        );
      } else {
        await setDoc(userRef, userData);
        dispatch(addUser(userData));
      }
      navigate("/");
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
    }
  };

  return (
    <div className="relative max-h-screen overflow-hidden">
      <div className="gap-3 columns-3">
        <img
          src={ImageO7}
          alt=""
          className="w-full mb-3 rounded-b aspect-auto"
        />
        <img src={ImageO1} alt="" className="w-full mb-3 rounded aspect-auto" />
        <img src={ImageO2} alt="" className="w-full mb-3 rounded aspect-auto" />
        <img src={ImageO3} alt="" className="w-full mb-3 rounded aspect-auto" />
        <img src={ImageO4} alt="" className="w-full mb-3 rounded aspect-auto" />
        <img src={ImageO5} alt="" className="w-full mb-3 rounded aspect-auto" />
        <img src={ImageO6} alt="" className="w-full mb-3 rounded aspect-auto" />
        <img src={ImageO1} alt="" className="w-full mb-3 rounded aspect-auto" />
        <img src={ImageO2} alt="" className="w-full mb-3 rounded aspect-auto" />
        <img src={ImageO3} alt="" className="w-full mb-3 rounded aspect-auto" />
        <img src={ImageO4} alt="" className="w-full mb-3 rounded aspect-auto" />
        <img src={ImageO5} alt="" className="w-full mb-3 rounded aspect-auto" />
      </div>

      <div className="absolute bottom-0 left-0 w-full pb-32 bg-white pt-7 rounded-t-3xl">
        <div className="flex items-center justify-center">
          <img src="/vibesnap-logo.png" />
          <h2 className="text-2xl font-medium">Vibesnap</h2>
        </div>
        <p className="mt-3 text-center">Moments That Matter, Shared Forever</p>
        <div className="flex items-center justify-center mt-10">
          <div
            className="flex items-center justify-center gap-5 py-4 bg-black rounded-full cursor-pointer ps-4 pe-6"
            onClick={loginWithGoogleAuth}
          >
            <FcGoogle className="text-3xl" />
            <p className="font-medium text-white">Continue with Google</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
