import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { Link } from "react-router-dom";
import { useAuth } from "../authContext";

const SearchAUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, "users")),
      (snapshot) => {
        const userDataArray = [];
        snapshot.forEach((doc) => {
          userDataArray.push({ id: doc.id, ...doc.data() });
        });
        setUsers(userDataArray);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsersWithoutAuthUser = filteredUsers.filter(
    (user) => user.id !== currentUser.uid
  );

  // Display only the first four users
  const limitedUsers = filteredUsersWithoutAuthUser.slice(0, 4);

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        value={searchTerm}
        onChange={handleSearch}
      />

      <h1 className="text-center py-5 uppercase font-bold text-2xl">
        User's{" "}
        <span className="text-primary decoration-secondary decoration-4 underline">
          Profile
        </span>
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {limitedUsers.map((user) => (
          <li
            key={user.id}
            className="bg-white flex flex-col justify-between items-center p-4 shadow rounded-md"
          >
            <div className="flex justify-center">
              {user.profilePhotoUrl && (
                <img
                  src={user.profilePhotoUrl}
                  alt="Profile"
                  className="mt-2 w-24 object-cover border border-secondary h-24 rounded-full"
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-500">Gender: {user.gender}</p>
              <p className="text-gray-500">Phone Number: {user.phoneNumber}</p>
              <p className="text-gray-500">Course: {user.course}</p>

              <p className="text-gray-500">
                Year & Section: {user.year} {user.section}
              </p>
              <p className="text-gray-500">
                Student Number: {user.studentNumber}
              </p>
            </div>
            <Link to={`/user/profile/${user.studentNumber}`}>
              <button className="btn btn-xs md:btn-sm btn-secondary text-white">
                View Profile
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchAUser;
