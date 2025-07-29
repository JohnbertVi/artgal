import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebaseConfig";
import Swal from "sweetalert2";
import logoblack from "../assets/logoblack.png";
import { onSnapshot, doc } from "firebase/firestore";

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(firestore, "users", userId);

        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setUserData(userData);
          } else {
            console.log("User document does not exist");
          }
        });

        return () => unsubscribeSnapshot();
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    const confirmation = await Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3545",
    });

    if (confirmation.isConfirmed) {
      try {
        await auth.signOut();
        navigate("/");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };

  return (
    <div className="navbar ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/gallery">Art Gallery</Link>
            </li>
            <li>
              <Link to="/post/art">Post An Art</Link>
            </li>
            <li>
              <Link to="/search/user">Search a User</Link>
            </li>
          </ul>
        </div>
        <Link to="/home" className="btn btn-ghost text-xl">
          <img className="h-10" src={logoblack} alt="" />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/gallery">Art Gallery</Link>
          </li>
          <li>
            <Link to="/post/art">Post An Art</Link>
          </li>
          <li>
            <Link to="/search/user">Search a User</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {userData && (
          <div className="flex items-center">
            <span className="text-black mr-2">Hello, {userData.firstName}</span>
          </div>
        )}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <img
              src={
                userData?.profilePhotoUrl ||
                "https://firebasestorage.googleapis.com/v0/b/artgallery-972bd.appspot.com/o/istockphoto-1393750072-612x612.jpg?alt=media&token=ec7a7208-fcfd-483f-902c-fe3470a734bb"
              }
              alt="Profile"
              className="h-12 w-12 object-cover border border-primary rounded-full"
            />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content  space-y-1 menu p-2 shadow bg-base-100 rounded-box w-40"
          >
            <li>
              <Link className="btn-xs btn-primary text-white btn" to="/profile">
                Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-xs text-black">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
