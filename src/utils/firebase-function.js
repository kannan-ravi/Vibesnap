import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const getPosts = async (postsRefArray, fields = []) => {
  if (!Array.isArray(postsRefArray) || postsRefArray.length === 0) {
    return [];
  }

  try {
    const postsData = await Promise.all(
      postsRefArray.map(async (postRef) => {
        if (typeof postRef === "string") {
          const postDocRef = doc(db, "posts", postRef);
          const postSnap = await getDoc(postDocRef);

          if (postSnap.exists()) {
            const postData = postSnap.data();
            const result = { id: postSnap.id };

            fields.forEach((field) => {
              result[field] = postData[field];
            });

            return result;
          } else {
            console.warn(`Post with ID ${postRef} does not exist.`);
            return null;
          }
        } else {
          console.warn("Invalid post reference type:", postRef);
          return null;
        }
      })
    );

    // Filter out `null` entries
    return postsData.filter((post) => post !== null);
  } catch (error) {
    console.error("Error in getPosts:", error);
    return [];
  }
};
