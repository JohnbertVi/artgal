import React, { useState, useEffect } from "react";
import { firestore, storage, auth } from "../firebaseConfig"; // Import Firestore and Storage
import { collection, onSnapshot, query, where } from "firebase/firestore"; // Import Firestore functions
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import banner from "../assets/banner.png";
import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDangerous } from "react-icons/md";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState([]);
  const [artsData, setArtsData] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    year: "",
    section: "",
    studentId: "",
  });

  const getCurrentUserId = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return currentUser.uid;
    } else {
      // Handle the case when there's no authenticated user
      return null;
    }
  };

  useEffect(() => {
    // Fetch user data
    const unsubscribeUsers = onSnapshot(
      collection(firestore, "users"),
      (snapshot) => {
        const userDataArray = [];
        snapshot.forEach((doc) => {
          userDataArray.push({ id: doc.id, ...doc.data() });
        });
        setUserData(userDataArray);
      }
    );

    // Fetch arts data where userId matches the authenticated user's userId
    const authUserId = getCurrentUserId(); // Implement your method to get the current authenticated user's userId
    const artsQuery = query(
      collection(firestore, "arts"),
      where("userId", "==", authUserId)
    );
    const unsubscribeArts = onSnapshot(artsQuery, (snapshot) => {
      const artsArray = [];
      snapshot.forEach((doc) => {
        artsArray.push({ id: doc.id, ...doc.data() });
      });
      setArtsData(artsArray);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeArts();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e, userId) => {
    e.preventDefault();
    try {
      const userDocRef = doc(firestore, "users", userId);
      await updateDoc(userDocRef, formData);
      Swal.fire({
        icon: "success",
        title: "Details Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      // Close the modal after displaying the success message
      document.getElementById("my_modal_" + userId).close();
    } catch (error) {
      console.error("Error updating user details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user details. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleImageUpload = async (event, userId) => {
    try {
      const file = event.target.files[0];
      const storageRef = ref(storage, `profile_images/${userId}/${file.name}`);

      // Show loading message
      Swal.fire({
        title: "Uploading Image...",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 2000,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });

      await uploadBytes(storageRef, file);
      const imageURL = await getDownloadURL(storageRef);
      console.log("Image uploaded successfully. URL:", imageURL);

      // Update the profilePhotoUrl in Firestore
      const userDocRef = doc(firestore, "users", userId);
      await updateDoc(userDocRef, { profilePhotoUrl: imageURL });
      console.log("Profile photo URL updated in Firestore.");

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Image Uploaded Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error uploading image:", error);

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to upload image. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };
  const openImageInFullScreen = (imageUrl) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: "Full Screen Image",
      showCloseButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      customClass: {
        image: "swal2-image-fullscreen",
      },
    });
  };

  const handleEditWatermark = (user) => {
    Swal.fire({
      title: "Edit Watermark",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Enter your watermark" value="${
          user.watermark || "Your Watermark"
        }">
      `,
      focusConfirm: false,
      preConfirm: async () => {
        const watermark = Swal.getPopup().querySelector("#swal-input1").value;
        console.log("Watermark:", watermark);

        // Update the watermark value in Firestore
        const userDocRef = doc(firestore, "users", user.id);
        try {
          await updateDoc(userDocRef, { watermark: watermark });
          Swal.fire({
            icon: "success",
            title: "Watermark Updated",
            showConfirmButton: false,
            timer: 3000,
          });
          console.log("Watermark updated successfully in Firestore.");
        } catch (error) {
          console.error("Error updating watermark in Firestore:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to update watermark. Please try again.",
            confirmButtonText: "OK",
          });
        }
      },
    });
  };

  return (
    <div className="min-full bg-gray-100 py-5 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        <h1 className="text-4xl font-extrabold tracking-wide text-center text-gray-800 mb-8">
          My Profile
        </h1>
        <div className="">
          {userData
            .filter((user) => user.id === getCurrentUserId()) // Filter to find the authenticated user's profile
            .map((user, index) => (
              <div
                key={index}
                className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200"
              >
                <img
                  src={banner}
                  style={{ zIndex: -1 }}
                  className=" w-full h-36 object-cover"
                  alt=""
                />
                <div className="w-full mt-[-60px] p-5 rounded-full">
                  <div
                    className="h-32 w-32 cursor-pointer"
                    onClick={() =>
                      openImageInFullScreen(
                        user.profilePhotoUrl ||
                          "https://firebasestorage.googleapis.com/v0/b/artgallery-972bd.appspot.com/o/istockphoto-1393750072-612x612.jpg?alt=media&token=ec7a7208-fcfd-483f-902c-fe3470a734bb"
                      )
                    }
                  >
                    <img
                      className="h-32 w-32 shadow-sm object-cover shadow-secondary rounded-full"
                      style={{ zIndex: 1 }}
                      src={
                        user.profilePhotoUrl ||
                        "https://firebasestorage.googleapis.com/v0/b/artgallery-972bd.appspot.com/o/istockphoto-1393750072-612x612.jpg?alt=media&token=ec7a7208-fcfd-483f-902c-fe3470a734bb"
                      }
                      alt="Profile"
                    />
                  </div>
                  <div className="md:flex justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {user.firstName} {user.lastName}
                        <p className="text-sm text-gray-500">
                          Student Number: {user.studentNumber}
                        </p>
                      </h2>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditWatermark(user)}
                        className="btn bg-[#fee67c] hover:bg-[#e9d372] text-[#295e2f] btn-xs md:btn-sm"
                      >
                        Edit Watermark
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-5 sm:px-6">
                  <p className="mt-1 text-sm text-gray-500">
                    Email: {user.email}
                  </p>
                  <p className="text-sm text-gray-500">Gender: {user.gender}</p>
                  <p className="text-sm text-gray-500">
                    Phone Number: {user.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-500">Course: {user.course}</p>{" "}
                  <p className="text-sm text-gray-500">
                    Year and Section: {user.year} {user.section}
                  </p>
                </div>
                <div className="flex gap-5 p-5 justify-between">
                  <div className="flex justify-start w-full">
                    <label className="btn btn-sm w-full  bg-[#295e2f] hover:bg-green-800 text-white">
                      Change Avatar
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, user.id)}
                      />
                    </label>
                  </div>
                  <div className=" w-full">
                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                    <button
                      className="btn w-full btn-sm bg-[#295e2f] hover:bg-green-800 text-white"
                      onClick={() =>
                        document
                          .getElementById("my_modal_" + user.id)
                          .showModal()
                      }
                    >
                      Edit Details
                    </button>
                    <dialog id={"my_modal_" + user.id} className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">Edit Details</h3>
                        <form className="py-4 px-4" method="dialog">
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              First Name
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Last Name
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Phone Number
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type="text"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Year
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type="text"
                              name="year"
                              value={formData.year}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Section
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type="text"
                              name="section"
                              value={formData.section}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Student ID
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type="text"
                              name="studentId"
                              value={formData.studentId}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <button
                              className="btn w-full btn-sm btn-primary text-white"
                              onClick={(e) => handleSubmit(e, user.id)}
                            >
                              Save Changes
                            </button>
                            <button
                              className="btn w-full btn-sm btn-base text-black"
                              onClick={() =>
                                document
                                  .getElementById("my_modal_" + user.id)
                                  .close()
                              }
                            >
                              Cancel Editing
                            </button>
                          </div>
                        </form>
                      </div>
                    </dialog>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className=" mt-10 mx-auto">
        <div className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200">
          <h1 className="text-center my-5 font-bold text-3xl">Your Arts</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {artsData.map((art) => (
              <Link key={art.id} to={`/art/info/${art.id}`}>
                <div
                  key={art.id}
                  className="glass rounded-lg shadow p-4 cursor-pointer relative"
                >
                  <div className="mb-4">
                    <h1 className="text-2xl font-semibold mb-2">{art.title}</h1>
                    {art.isHidden && (
                      <div className="text-xs bg-error text-center flex justify-center gap-2 items-center text-white rounded-md">
                        <MdDangerous className="" size={14} />
                        Rejected by Admin
                      </div>
                    )}
                    {art.isApproved && (
                      <div className="text-xs bg-[#295e2f] text-center flex justify-center gap-2 items-center text-white rounded-md">
                        <FaCheckCircle className="" size={14} />
                        Approved by Admin
                      </div>
                    )}
                    {!art.isApproved && !art.isHidden && (
                      <div className="text-xs bg-secondary text-center flex justify-center gap-2 items-center text-white rounded-md">
                        <AiOutlineLoading3Quarters
                          className="animate-spin"
                          size={14}
                        />
                        Waiting for Approval
                      </div>
                    )}
                    <p className="text-gray-600 text-xs">{art.description}</p>
                  </div>
                  <div>
                    {art.photos.length > 0 && (
                      <img
                        className="w-full h-36 object-cover rounded-lg mb-2"
                        src={art.photos[0]}
                        alt={`Art 1`}
                      />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
