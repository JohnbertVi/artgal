import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { firestore } from "../firebaseConfig";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import logospin from "../assets/logospin.png";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../authContext";
import { collection, getDocs } from "firebase/firestore";
import { MdDangerous } from "react-icons/md";
import Swal from "sweetalert2";

const ArtInfo = () => {
  const { id } = useParams();
  const [art, setArt] = useState(null);
  const [user, setUser] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [numCommentsToShow, setNumCommentsToShow] = useState(10);
  // eslint-disable-next-line
  const [commentIncrement, setCommentIncrement] = useState(10);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchArt = async () => {
      try {
        const artDocRef = doc(firestore, "arts", id);
        const unsubscribe = onSnapshot(artDocRef, (doc) => {
          if (doc.exists()) {
            const artData = { id: doc.id, ...doc.data() };
            setArt(artData);

            const userData = users.find(
              (user) => user.userId === artData.userId
            );
            setUser(userData);

            setLikeCount(artData.likes.length);
            setLiked(artData.likes.includes(currentUser.uid));
            setComments(artData.comments || []);
          } else {
            console.log("No such art document!");
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchArt();
  }, [id, currentUser.uid, users]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, "users"));
        const usersData = usersSnapshot.docs.map((doc) => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleLike = async () => {
    try {
      if (!currentUser) {
        console.error("User data not available.");
        return;
      }

      if (!art) {
        console.error("Art data not available.");
        return;
      }

      if (liked) {
        return;
      }

      await updateDoc(doc(firestore, "arts", id), {
        likes: arrayUnion(currentUser.uid),
      });
    } catch (error) {
      console.error("Error liking art:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      if (!currentUser) {
        console.error("User data not available.");
        return;
      }

      if (!art) {
        console.error("Art data not available.");
        return;
      }

      if (!liked) {
        return;
      }

      await updateDoc(doc(firestore, "arts", id), {
        likes: arrayRemove(currentUser.uid),
      });
    } catch (error) {
      console.error("Error unliking art:", error);
    }
  };

  const handleComment = async () => {
    try {
      if (!currentUser) {
        console.error("Authenticated user not available.");
        return;
      }

      await updateDoc(doc(firestore, "arts", id), {
        comments: arrayUnion({
          userId: currentUser.uid,
          comment: comment,
        }),
      });

      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleShowMoreComments = () => {
    setNumCommentsToShow(
      (prevNumComments) => prevNumComments + commentIncrement
    );
  };

  const openImageInFullScreen = (imageUrl, watermark) => {
    Swal.fire({
      imageAlt: "Art",
      html: `
        <div style="position: relative;" class="art-container">
          <img src="${imageUrl}" alt="Art" class="swal2-image-fullscreen mx-auto art-image"/>
          <span class="absolute inset-0 flex items-center select-none pointer-events-none justify-center text-black font-extrabold uppercase text-2xl opacity-40 art-watermark">${watermark}</span>  
          <div class="art-overlay"></div>
        </div>
      `,
      showCloseButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      didOpen: () => {
        const imgElem = document.querySelector('.swal2-image-fullscreen');
        const overlay = document.createElement('div');
        overlay.className = 'art-overlay swal2-overlay-protect';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.7)';
        overlay.style.color = 'white';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.fontSize = '2vw';
        overlay.style.fontWeight = 'bold';
        overlay.style.zIndex = '100';
        overlay.style.pointerEvents = 'none';
        overlay.style.opacity = '0';
        overlay.innerText = 'Protected Artwork';
        // Add overlay to modal
        const container = document.querySelector('.swal2-popup .art-container');
        if (container) container.appendChild(overlay);
        // Helper functions
        const showOverlay = () => {
          overlay.style.opacity = '1';
          if (imgElem) imgElem.classList.add('art-blurred');
        };
        const hideOverlay = () => {
          overlay.style.opacity = '0';
          if (imgElem) imgElem.classList.remove('art-blurred');
        };
        // Always blur when window loses focus
        window.addEventListener('blur', showOverlay);
        window.addEventListener('focus', hideOverlay);
        // Also blur on visibility change (tab switch)
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState !== 'visible') {
            showOverlay();
          } else {
            hideOverlay();
          }
        });
        // Screenshot key detection
        const screenshotKeys = (e) => {
          if (
            e.key === 'PrintScreen' ||
            (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'c')) ||
            (e.shiftKey && e.key.toLowerCase() === 's' && (e.metaKey || e.getModifierState('Meta') || e.getModifierState('OS')))
          ) {
            showOverlay();
            setTimeout(hideOverlay, 5000);
          }
        };
        document.addEventListener('keydown', screenshotKeys);
        // Clean up event listeners when modal closes
        Swal.getPopup().addEventListener('swal2:close', () => {
          window.removeEventListener('blur', showOverlay);
          window.removeEventListener('focus', hideOverlay);
          document.removeEventListener('visibilitychange', showOverlay);
          document.removeEventListener('keydown', screenshotKeys);
          if (container && overlay) container.removeChild(overlay);
        });
        // Initial state: always show overlay if not focused
        if (document.visibilityState !== 'visible' || document.hasFocus() === false) {
          showOverlay();
        } else {
          hideOverlay();
        }
      }
    });
  };

  const handleDeleteArt = () => {
    Swal.fire({
      title: "Are you sure you want to delete this post?",
      text: "This action can't be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(firestore, "arts", id));
          Swal.fire({
            title: "Deleted!",
            text: "Your art has been deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          navigate("/profile");
        } catch (error) {
          console.error("Error deleting art:", error);
          Swal.fire(
            "Error!",
            "An error occurred while deleting the art.",
            "error"
          );
        }
      }
    });
  };

  if (!art || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          className="lg:h-32 animate-spin h-20 md:h-28 object-contain mx-auto"
          src={logospin}
          alt="logo"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-4 shadow rounded-md">
        <div className="flex gap-2 items-center">
          <img
            src={user.profilePhotoUrl}
            className="w-14 h-14 border border-secondary rounded-full object-cover"
            alt=""
          />
          <div>
            <p className="text-gray-600 mt-2">
              {user.firstName} {user.lastName}
            </p>
            <div className="flex gap-1">
              {art.userId !== currentUser.uid && (
                <Link
                  className="btn bg-[#fee67c] text-[#295e2f] hover:bg-[#f4dd7a] hover:shadow-sm btn-xs"
                  to={`/user/profile/${user.studentNumber}`}
                >
                  View Profile
                </Link>
              )}

              {art.userId === currentUser.uid && (
                <Link
                  className="btn btn-primary text-white btn-xs"
                  to={`/edit/art/${art.id}`}
                >
                  Edit Art
                </Link>
              )}
              {art.userId === currentUser.uid && (
                <button
                  className="btn btn-error text-white btn-xs"
                  onClick={handleDeleteArt}
                >
                  Delete Art
                </button>
              )}
            </div>
          </div>
        </div>

        <h1 className="text-sm flex items-center  font-semibold my-2">
          {art.isApproved ? (
            ""
          ) : (
            <MdDangerous className=" text-error" size={14} />
          )}{" "}
          {art.isApproved ? "" : "You can only see this art. "}
        </h1>

        <h1 className="text-2xl font-semibold mb-2">{art.title}</h1>
        <p className="text-gray-600">{art.description}</p>

        <div className={`gap-2 grid p-2 grid-cols-${art.photos.length}`}>
          {art.photos.map((photo, index) => (
            <div
              key={index}
              onClick={() => openImageInFullScreen(photo, user.watermark)}
            >
              <div style={{ position: "relative" }} className="art-container">
                <img
                  key={index}
                  className={`w-full object-cover rounded-lg h-56 cursor-pointer art-image`}
                  src={photo}
                  alt={`Arts ${index + 1}`}
                />
                <span className="absolute inset-0 flex items-center select-none pointer-events-none justify-center text-black font-extrabold uppercase text-xs md:text-lg lg:text-2xl opacity-40 art-watermark">
                  {user.watermark}
                </span>
                <div className="art-overlay"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 mt-4">
          <div>
            <button
              className="btn btn-xs md:btn-sm bg-[#295e2f] hover:bg-green-800 text-white"
              onClick={liked ? handleUnlike : handleLike}
            >
              {liked ? "Liked" : "Like"}
              {liked ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex justify-center flex-col items-center">
              <div className="stat-title">Total Likes</div>
              <div className="font-bold flex items-center gap-1 text-red-700">
                {likeCount}
                <FaHeart  />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white mt-2 p-4 shadow rounded-md">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        {comments.slice(0, numCommentsToShow).map((comment, index) => {
          const commentUser = users.find(
            (user) => user.userId === comment.userId
          );
          return (
            <div key={index} className="flex items-center gap-2">
              {commentUser && (
                <img
                  src={commentUser.profilePhotoUrl}
                  className="w-10 h-10 border border-secondary rounded-full object-cover"
                  alt=""
                />
              )}
              <div>
                {commentUser && (
                  <p className="font-semibold">{`${commentUser.firstName} ${commentUser.lastName}`}</p>
                )}
                <p className="text-gray-600">{comment.comment}</p>
              </div>
            </div>
          );
        })}

        {comments.length > numCommentsToShow && (
          <button
            className="btn btn-xs md:btn-sm btn-secondary mt-2"
            onClick={handleShowMoreComments}
          >
            Show More Comments
          </button>
        )}
      </div>

      <div className="bg-white mt-2 p-4 shadow rounded-md">
        <input
          type="text"
          placeholder="Comment here"
          className="w-full border border-gray-300 rounded-md p-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="btn btn-xs md:btn-sm text-[#295e2f] py-1 bg-[#fee67c] hover:bg-[#e9d372] mt-2"
          onClick={handleComment}
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default ArtInfo;
