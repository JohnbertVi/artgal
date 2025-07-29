import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const EditArt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [art, setArt] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const artDocRef = doc(firestore, "arts", id);
        const artDocSnap = await getDoc(artDocRef);
        if (artDocSnap.exists()) {
          setArt({ id: artDocSnap.id, ...artDocSnap.data() });
          setTitle(artDocSnap.data().title);
          setDescription(artDocSnap.data().description);
          setPhotos(artDocSnap.data().photos);
        } else {
          console.log("No such art document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchArt();
  }, [id]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePhotoClick = (index) => {
    Swal.fire({
      imageUrl: photos[index],
      imageAlt: "Full Screen Image",
      showCloseButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      customClass: {
        image: "swal2-image-fullscreen",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(firestore, "arts", id), {
        title: title,
        description: description,
        photos: photos,
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your art has been updated successfully.",
      }).then(() => {
        navigate("/gallery");
      });
    } catch (error) {
      console.error("Error updating art:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while updating your art. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Edit Art</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Photos:</label>
          <div className="flex gap-2">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="flex items-center shadow-md hover:shadow-primary mb-2"
                onClick={() => handlePhotoClick(index)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={photo}
                  alt={`Arts ${index}`}
                  className="w-32 h-32 object-cover mr-2 rounded-md"
                />
              </div>
            ))}
          </div>
          <label className="block italic text-xs text-error mb-1">
            Sorry, photos can't be edited.
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block font-semibold mb-1">
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block font-semibold mb-1">
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="w-full border rounded-md p-2"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-md py-2"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditArt;
