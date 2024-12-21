import React, { useEffect, useState } from "react";
import FeedsHeader from "../../components/feeds/FeedsHeader";
import FeedsCard from "../../components/feeds/FeedsCard";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPost } from "../../app/features/postSlice";
import { Client } from "appwrite";
import { toastError } from "../../app/features/toastSlice";

const Feeds = () => {
  const client = new Client();
  client.setProject("vibesnap");

  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.post);

  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 20;

  const getUserData = async (userRef) => {
    if (!userRef) return null;
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  };

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const postRef = collection(db, "posts");
      const postsQuery = lastDoc
        ? query(
            postRef,
            orderBy("created_at"),
            startAfter(lastDoc),
            limit(LIMIT)
          )
        : query(postRef, orderBy("created_at"), limit(LIMIT));

      const snapShot = await getDocs(postsQuery);
      if (!snapShot.empty) {
        const newPosts = await Promise.all(
          snapShot.docs.map(async (doc) => {
            const postData = { id: doc.id, ...doc.data() };
            const userData = await getUserData(postData.posted_by);
            return {
              ...postData,
              posted_by: userData,
            };
          })
        );

        dispatch(
          fetchAllPost([
            ...(posts || []),
            ...newPosts.filter(
              (newPost) => !posts.some((post) => post.id === newPost.id)
            ),
          ])
        );
        setLastDoc(snapShot.docs[snapShot.docs.length - 1]);

        if (snapShot.docs.length < LIMIT) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
      dispatch(toastError("Failed to fetch posts"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      if (hasMore && !loading) {
        fetchPosts();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="relative px-4 py-7">
      <FeedsHeader />
      <h1 className="mt-8 text-3xl font-semibold">Feeds</h1>

      <div className="flex flex-col gap-10 mt-5">
        {posts && posts.length > 0 && !loading
          ? posts?.map((post) => <FeedsCard key={post.id} data={post} />)
          : !loading && (
              <div className="mt-10">
                <p className="text-lg text-center">No Post Found</p>
              </div>
            )}
      </div>

      {loading && (
        <div className="flex items-center justify-center my-6">
          <div className="w-10 h-10 border-2 border-t-2 border-black animate-spin"></div>
        </div>
      )}
      {!hasMore && !loading && (
        <p className="mt-6 text-center text-gray-500">No more posts to load.</p>
      )}

      <Link
        to="/create-post"
        className="fixed z-10 p-3 text-3xl text-white translate-x-1/2 bg-black rounded-full shadow-lg cursor-pointer bottom-5 right-1/2"
      >
        <FaPlus />
      </Link>
    </div>
  );
};

export default Feeds;
