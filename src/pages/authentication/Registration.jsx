import React, { useState } from "react";
import { auth, firestore } from "../../firebaseConfig";
import bg from "../../assets/bg.png";
import paint from "../../assets/paint.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
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
  const [step, setStep] = useState(1);
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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <img
        className="fixed inset-0 w-full h-full object-cover opacity-100 pointer-events-none select-none"
        src={bg}
        alt=""
      />
      <div className="w-full md:max-w-4xl max-w-lg rounded-2xl md:flex bg-gray-50 shadow-xl overflow-hidden relative z-10 min-h-0">
          <img
            className="hidden md:flex flex-col w-auto h-auto object-cover rounded-tl-2xl rounded-bl-2xl"
            src={paint}
            alt=""
          />
        <div className="flex-1 px-8 py-6 flex flex-col justify-center min-h-0">
          <div className="text-center mb-6 space-y-3">
            <h2 className="text-4xl font-extrabold text-gray-900">Sign Up</h2>
            <h1 className="text-xs">
              Already have an account?{" "}
              <Link to="/" className="text-primary font-bold">
                Login now!
              </Link>
            </h1>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <form
              className="space-y-6"
              onSubmit={
                step === 1
                  ? (e) => {
                      e.preventDefault();
                      setStep(2);
                    }
                  : handleSubmit
              }
            >
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-sm"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-sm"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-sm"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone-number"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
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
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="course"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
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
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-sm"
                      placeholder="Enter your course"
                    />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-sm"
                        placeholder="Enter your year"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="section"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-sm"
                        placeholder="Enter your section"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="student-number"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
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
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-sm"
                      placeholder="Enter your student number"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-sm"
                        placeholder="Create a password"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-sm"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Gender
                    </label>
                    <div className="flex flex-wrap items-center gap-6">
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
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Male
                        </label>
                      </div>
                      <div className="flex items-center">
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
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Female
                        </label>
                      </div>
                      <div className="flex items-center">
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
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Others
                        </label>
                      </div>
                    </div>
                  </div>
                  {error && (
                    <p className="text-red-500 text-center text-sm">{error}</p>
                  )}
                </div>
              )}
              <div className="pt-4">
                {step === 1 ? (
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200"
                  >
                    Create Account
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
