import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import banner from "../assets/banner.png";
import logospin from "../assets/logospin.png";

const UserProfile = () => {
  const { studentNumber } = useParams();
  const [user, setUser] = useState(null);
  const [arts, setArts] = useState([]);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      const userQuery = query(
        collection(firestore, "users"),
        where("studentNumber", "==", studentNumber)
      );
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setUser(userData);
      }
    };

    const fetchArts = async () => {
      if (user && user.userId) {
        // Check if user and userId are not null
        const artsQuery = query(
          collection(firestore, "arts"),
          where("userId", "==", user.userId) // Filter arts by user ID
        );

        const artsSnapshot = await getDocs(artsQuery);
        const artsData = [];

        artsSnapshot.forEach((doc) => {
          artsData.push({ id: doc.id, ...doc.data() });
        });

        setArts(artsData);
      }
    };

    fetchUser();
    fetchArts();
  }, [studentNumber, user]); // Removed user.userId from the dependency array

  if (!user) {
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
    <div className="container mx-auto p-6">
      <div className="bg-white shadow rounded-md">
        <div className="flex justify-center">
          <img src={banner} className=" w-full h-36 object-cover" alt="" />
        </div>
        <div className="p-4 ">
          {user.profilePhotoUrl && (
            <img
              src={user.profilePhotoUrl}
              alt="Profile"
              className="w-24 z-10 mt-[-60px] object-cover border border-secondary h-24 rounded-full"
            />
          )}
          <h3 className="text-lg font-semibold">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-gray-500">Email: {user.email}</p>
          <p className="text-gray-500">Gender: {user.gender}</p>
          <p className="text-gray-500">Phone Number: {user.phoneNumber}</p>
          <p className="text-gray-500">Course: {user.course}</p>
          <p className="text-gray-500">
            Year & Section: {user.year} {user.section}
          </p>
          <p className="text-gray-500">Student Number: {user.studentNumber}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">{user.firstName}'s Arts:</h2>
        {arts.length === 0 ? (
          <p>{user.firstName} has no arts yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
            {arts.map((art) => (
              <Link key={art.id} to={`/art/info/${art.id}`}>
                <div
                  key={art.id}
                  className="bg-white flex flex-col h-full justify-between p-4 shadow hover:shadow-secondary rounded-md"
                >
                  <p className="text-primary font-bold text-lg">{art.title}</p>
                  <p className="text-gray-700 text-xs text-justify">
                    {art.description}
                  </p>
                  <div className="relative">
                    <img
                      src={art.photos}
                      alt="Artwork"
                      className="w-full h-40 object-cover mb-4 rounded-md"
                    />{" "}
                    <span className="absolute inset-0 flex items-center select-none pointer-events-none justify-center text-black font-extrabold uppercase text-2xl opacity-40">
                      {user.watermark}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
