import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { Link } from "react-router-dom";

const SearchArt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [arts, setArts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "arts"),
      (snapshot) => {
        const artsArray = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            likes: data.likes || [],
            comments: data.comments || [],
          };
        });
        setArts(artsArray);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Only show approved arts
  const approvedArts = arts.filter((art) => art.isApproved);
  const filteredArts = approvedArts.filter((art) =>
    art.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Search art by title..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        value={searchTerm}
        onChange={handleSearch}
      />
      <h1 className="text-center text-4xl font-extrabold tracking-wide  py-5 uppercase">
        Art <span className="text-[#295e2f] decoration-[#fee67c] decoration-4 underline">Search</span>
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredArts.map((art) => (
          <li key={art.id} className="bg-white flex flex-col justify-between items-center p-4 shadow rounded-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
            <div className="w-full flex justify-center mb-2 art-container">
              <img
                src={art.photos && art.photos[0] ? art.photos[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={art.title ? `Artwork: ${art.title}` : 'Artwork'}
                className="w-full max-w-xs h-48 object-cover border border-secondary rounded shadow art-image"
              />
              <div className="art-overlay"></div>
            </div>
            <div className="w-full text-center">
              <h3 className="text-lg font-semibold mt-2">{art.title}</h3>
              <p className="text-gray-500">{art.description}</p>
              <div className="flex gap-2 justify-center my-2">
                <span className="px-2 text-xs rounded-md text-white py-1 bg-[#295e2f] hover:bg-green-800">Likes: {art.likes.length}</span>
                <span className="px-2 text-xs rounded-md text-[#295e2f] py-1 border-2 border-[#295e2f]">Comments: {art.comments.length}</span>
              </div>
            </div>
            <Link to={`/art/info/${art.id}`} className="w-full flex justify-center mt-2">
              <button className="btn btn-xs md:btn-sm bg-[#fee67c] hover:bg-[#e9d372] shadow shdadow-lg text-[#295e2f] w-full">View Art</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchArt;
