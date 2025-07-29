import React, { useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import logospin from "../assets/logospin.png";

const Gallery = () => {
  const [arts, setArts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeArts = onSnapshot(
      collection(firestore, "arts"),
      (snapshot) => {
        const artsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            likes: data.likes || [],
            comments: data.comments || [],
          };
        });
        setArts(artsData);
      }
    );

    // Fetch users data
    const unsubscribeUsers = onSnapshot(
      collection(firestore, "users"),
      (snapshot) => {
        const usersData = {};
        snapshot.forEach((doc) => {
          usersData[doc.id] = doc.data();
        });
        setUsers(usersData);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeArts();
      unsubscribeUsers();
    };
  }, []);

  const approvedArts = arts.filter((art) => art.isApproved);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <img
            className="lg:h-32 animate-spin h-20 md:h-28 object-contain mx-auto"
            src={logospin}
            alt=""
          />
        </div>
      ) : (
        <div className="py-16">
          <div className="grid grid-cols-1 px-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedArts.map((art) => (
              <Link key={art.id} to={`/art/info/${art.id}`}>
                <div
                  key={art.id}
                  className="glass rounded-lg flex flex-col justify-between h-full shadow hover:shadow-secondary p-4 cursor-pointer relative"
                >
                  {users[art.userId] && (
                    <div className="flex items-center mt-4">
                      <img
                        className="w-11 h-11 border border-primary object-cover rounded-full mr-2"
                        src={users[art.userId].profilePhotoUrl}
                        alt={`${users[art.userId].firstName}'s Profile`}
                      />
                      <span className="font-semibold">{`${
                        users[art.userId].firstName
                      } ${users[art.userId].lastName}`}</span>
                    </div>
                  )}
                  <div className="my-4">
                    <h1 className="text-2xl font-semibold mb-2">{art.title}</h1>
                    <p className="text-gray-600">{art.description}</p>
                  </div>
                  <div className="relative">
                    <img
                      className="w-full h-36 object-cover rounded-lg mb-2"
                      src={art.photos[0]}
                      alt={`Arts 1`}
                    />
                    {users[art.userId] && (
                      <span className="absolute inset-0 flex items-center select-none pointer-events-none justify-center text-black font-extrabold uppercase text-2xl opacity-40">
                        {users[art.userId].watermark}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <h1 className=" px-2 text-xs rounded-md text-white py-1 bg-primary">
                      Likes: {art.likes.length}
                    </h1>
                    <h1 className=" px-2 text-xs rounded-md text-white py-1 bg-secondary">
                      Comments: {art.comments.length}
                    </h1>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
