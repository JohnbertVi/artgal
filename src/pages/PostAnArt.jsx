import React, { useState, useEffect } from "react";
import { storage, firestore, auth } from "../firebaseConfig"; // Import auth from firebaseConfig
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const PostAnArt = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [studentNumber, setStudentNumber] = useState(null);
  const [posting, setPosting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setStudentNumber(user.studentNumber);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePhotoUpload = async (e) => {
    try {
      setUploading(true);
      const files = e.target.files;
      const newPhotos = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `art_photos/${file.name}`);
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        newPhotos.push({ url: photoURL, file });
      }

      const totalPhotos = photos.length + newPhotos.length;
      if (totalPhotos > 4) {
        throw new Error("You can upload up to 4 photos per post.");
      }

      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading photos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to upload photos. Please try again.",
        confirmButtonText: "OK",
      });
      setUploading(false);
    }
  };
  const handleDeletePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setPosting(true);

      if (photos.length === 0) {
        throw new Error("Please upload at least one photo.");
      }

      const artData = {
        title,
        description,
        photos: [],
        userId,
        studentNumber: studentNumber || "",
        comments: [], // Add comments field with initial empty array
        likes: [], // Add likes field with initial empty array
      };

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const photoRef = ref(storage, `art_photos/${photo.file.name}`);
        await uploadBytes(photoRef, photo.file);
        const photoURL = await getDownloadURL(photoRef);
        artData.photos.push(photoURL);
      }

      const docRef = await addDoc(collection(firestore, "arts"), artData);
      console.log("Art added with ID: ", docRef.id);

      setTitle("");
      setDescription("");
      setPhotos([]);
      Swal.fire({
        icon: "success",
        title: "Art Posted Successfully",
        text: "Please wait for the admin's approval",
        showConfirmButton: false,
        timer: 3500,
      }).then(() => {
        navigate("/profile");
      });
      setPosting(false);
    } catch (error) {
      console.error("Error posting art:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to post art. Please try again.",
        confirmButtonText: "OK",
      });
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          <span className="text-primary">Post</span> an{" "}
          <span className="underline decoration-4 decoration-secondary">
            Ar
          </span>
          t
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload Photos
            </label>
            <input
              id="uploadInput"
              type="file"
              className="hidden"
              multiple
              onChange={handlePhotoUpload}
              accept="image/*"
            />
            <button
              className="btn btn-secondary text-black btn-sm"
              type="button"
              onClick={() => {
                const input = document.getElementById("uploadInput");
                if (input && !uploading && photos.length < 4) input.click();
              }}
              disabled={uploading || photos.length === 4}
            >
              {uploading ? "Uploading..." : "Choose Photos"}
            </button>

            <div className="mt-2 flex flex-wrap">
              {photos.map((photo, index) => (
                <div key={index} className="relative w-32 h-32 mr-2 mb-2">
                  <img
                    src={photo.url}
                    alt={`Uploaded Photos ${index + 1}`}
                    className="object-cover w-full h-full rounded"
                  />
                  <button
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    onClick={() => handleDeletePhoto(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 00-2 0v6a1 1 0 102 0V6zm0 8a1 1 0 00-2 0v1a1 1 0 102 0v-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <h1 className="text-error text-xs italic">
            You can upload up to 4 photos per post
          </h1>
          <div className="flex justify-center">
            <button
              className="btn btn-primary text-white"
              type="submit"
              disabled={posting}
            >
              {posting ? "Posting..." : "Post Art"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostAnArt;
