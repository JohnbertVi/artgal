import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "./firebaseConfig";
import ImageProtection from "./components/ImageProtection";
import Login from "./pages/authentication/Login";
import Registration from "./pages/authentication/Registration";
import Hero from "./pages/Hero";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./authContext";
import Profile from "./pages/Profile";
import PostAnArt from "./pages/PostAnArt";
import Gallery from "./pages/Gallery";
import logospin from "./assets/logospin.png";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApproved from "./pages/admin/AdminApproved";
import SearchAUser from "./pages/SearchAUser";
import SearchArt from "./pages/SearchArt";
import UserProfile from "./pages/UserProfile";
import ArtInfo from "./pages/ArtInfo";
import EditArt from "./pages/EditArt";

function AppRoutes() {
  const location = useLocation();

  const navbarHiddenRoutes = [
    "/",
    "/register",
    "/admin/dashboard",
    "/admin/approved",
  ];

  const isNavbarHidden = navbarHiddenRoutes.includes(location.pathname);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  // eslint-disable-next-line
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        try {
          const docRef = doc(firestore, "users", authUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
            localStorage.setItem("userData", JSON.stringify(docSnap.data()));
            console.log("Fetched user data:", docSnap.data());
          } else {
            setUserData(null);
            localStorage.removeItem("userData");
            console.log("User data does not exist.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false); // Set loading to false after fetching user data
        }
      } else {
        setUser(null);
        setUserData(null);
        localStorage.removeItem("userData");
        setLoading(false); // Set loading to false if no user is authenticated
      }
    });

    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          className="lg:h-32 animate-spin h-20 md:h-28 object-contain mx-auto"
          src={logospin}
          alt=""
        />
      </div>
    ); // Render loading indicator while fetching data
  }

  const isAdmin = user && user.email === "admin@gmail.com";

  return (
    <div className="App">
      <ImageProtection />
      {!isNavbarHidden && <Navbar />}

      <Routes>
        {/* Routes */}
        {!isAdmin && (
          <>
            <Route
              path="/"
              element={user ? <Navigate to="/home" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/home" /> : <Registration />}
            />
            <Route
              path="/home"
              element={user ? <Hero /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/" />}
            />
            <Route
              path="/post/art"
              element={user ? <PostAnArt /> : <Navigate to="/" />}
            />
            <Route
              path="/gallery"
              element={user ? <Gallery /> : <Navigate to="/" />}
            />
            <Route
              path="/search/user"
              element={user ? <SearchAUser /> : <Navigate to="/" />}
            />
            <Route
              path="/search/art"
              element={user ? <SearchArt /> : <Navigate to="/" />}
            />
            <Route
              path="/user/profile/:studentNumber"
              element={<UserProfile />}
            />
            <Route path="/art/info/:id" element={<ArtInfo />} />
            <Route path="/edit/art/:id" element={<EditArt />} />
          </>
        )}

        {isAdmin && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/approved" element={<AdminApproved />} />

            {/* Add more admin routes as needed */}
          </>
        )}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
