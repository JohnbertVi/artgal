import React, { useState } from "react";
import { auth, firestore } from "../../firebaseConfig"; // Importing firestore
import bg from "../../assets/bg.png";
import paint from "../../assets/paint.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore"; // Importing functions to add document to Firestore
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [course, setCourse] = useState("");
  const navigate = useNavigate();
  const profilePhotoUrl =
    "https://firebasestorage.googleapis.com/v0/b/artgallery-972bd.appspot.com/o/istockphoto-1393750072-612x612.jpg?alt=media&token=ec7a7208-fcfd-483f-902c-fe3470a734bb";
  console.log(error);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        firstName &&
        lastName &&
        email &&
        phoneNumber &&
        year &&
        section &&
        studentNumber &&
        password &&
        confirmPassword &&
        gender
      ) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
        } else {
          // Create user with email and password using auth
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          const user = userCredential.user;
          console.log(user);

          // Store additional user data in Firestore
          const userData = {
            userId: user.uid, // Adding userId
            firstName,
            lastName,
            email,
            phoneNumber,
            year,
            section,
            studentNumber,
            gender,
            profilePhotoUrl,
            course,
            watermark: firstName,
          };

          // Set the document ID to userId
          await setDoc(doc(firestore, "users", user.uid), userData);

          // Reset form fields
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhoneNumber("");
          setCourse("");
          setYear("");
          setSection("");
          setStudentNumber("");
          setPassword("");
          setConfirmPassword("");
          setGender("");

          // Show success message
          Swal.fire({
            title: "Registration Successful!",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            navigate("/");
          });
        }
      } else {
        setError("Please fill in all fields");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        timer: 3000, // Display the alert for 3 seconds
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 sm:px-6 lg:px-8">
      <img
        className="z-[-1] absolute h-screen w-screen mx-auto object-cover pointer-events-none select-none"
        src={bg}
        alt=""
      />
      <div className="md:max-w-2xl max-w-lg rounded-md md:flex h-full bg-gray-50 w-full space-y-8">
        <div className="h-full rounded-md md:block hidden">
          <img className="w-96 rounded-md object-cover" src={paint} alt="" />
        </div>

        <div className="px-10">
          <div>
            <h2 className=" text-center text-2xl md:text-3xl font-extrabold text-gray-900">
              Register for an account
            </h2>
            <h1 className="text-xs text-center ">
              Already have an account?{" "}
              <Link to="/" className="text-primary font-bold">
                Login now!
              </Link>
            </h1>
          </div>

          <form className="mt-1 text-xs space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md space-y-1">
              <div className="grid  grid-cols-2 gap-2">
                <div>
                  <label htmlFor="first-name" className="sr-only">
                    First Name
                  </label>
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="sr-only">
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Last Name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="phone-number" className="sr-only">
                  Phone Number
                </label>
                <input
                  id="phone-number"
                  name="phone-number"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label htmlFor="course" className="sr-only">
                  Course
                </label>
                <input
                  id="course"
                  name="course"
                  type="text"
                  autoComplete="off"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Course"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="year" className="sr-only">
                    Year
                  </label>
                  <input
                    id="year"
                    name="year"
                    type="text"
                    autoComplete="off"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Year"
                  />
                </div>
                <div>
                  <label htmlFor="section" className="sr-only">
                    Section
                  </label>
                  <input
                    id="section"
                    name="section"
                    type="text"
                    autoComplete="off"
                    required
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Section"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="student-number" className="sr-only">
                  Student Number
                </label>
                <input
                  id="student-number"
                  name="student-number"
                  type="text"
                  autoComplete="off"
                  required
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Student Number"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
              <div>
                <p className="text-gray-700">Gender:</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <input
                      id="male"
                      name="gender"
                      type="radio"
                      value="Male"
                      onChange={(e) => setGender(e.target.value)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      required
                    />
                    <label
                      htmlFor="male"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Male
                    </label>
                  </div>
                  <div className="flex items-center ">
                    <input
                      id="female"
                      name="gender"
                      type="radio"
                      value="Female"
                      onChange={(e) => setGender(e.target.value)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      required
                    />
                    <label
                      htmlFor="female"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Female
                    </label>
                  </div>
                  <div className="flex items-center ">
                    <input
                      id="prefer-not-to-say"
                      name="gender"
                      type="radio"
                      value="Prefer not to say"
                      onChange={(e) => setGender(e.target.value)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      required
                    />
                    <label
                      htmlFor="prefer-not-to-say"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Others
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pb-10">
              <button
                type="submit"
                className="btn text-white btn-primary w-full"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
