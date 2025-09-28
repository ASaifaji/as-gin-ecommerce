import React, { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../lib/api"; // axios instance

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setusername] = useState("");
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (username === "") {
      toast.error("Full Name is required!");
    } else if (password === "") {
      toast.error("Password is required!");
    } else if (password.length < 8) {
      toast.error("Password must be at least 8 characters!");
    } else if (email === "") {
      toast.error("Email is required!");
    } else {
      try {
        const res = await api.post("user", { username, email, password });

        console.log("Response dari backend:", res.data);

        if (res.status === 200) {
          toast.success(res.data.message);
          setTimeout(() => navigate("/login"), 1500);
        } else {
          toast.error(res.data.error || "Registrasi gagal!");
        }
      } catch (err) {
        toast.error(err.response?.data?.error || "Registrasi gagal!");
      }
    }
  };

  return (
    <div className="max-w-[100%] mx-auto">
      <div className="flex items-center justify-between text-purple-500 font-bold m-5 p-1">
        <Link to={"/login"}>
          <div className="cursor-pointer flex items-center text-xs">
            <MdArrowBackIos />
            Back to login
          </div>
        </Link>

        <div className="cursor-pointer text-xs">Need any help?</div>
      </div>
      <h1 className="text-2xl text-gray-800 font-medium text-center mt-10 p-2">
        Registration
      </h1>
      <p className="text-gray-500 leading-5 mb-2 text-center">
        Fill the details to register
      </p>

      <form
        onSubmit={handlesubmit}
        className="flex flex-col justify-center items-center"
      >
        <label className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            className="my-2 mx-1 w-[270px] xs:w-[360px] md:w-[450px] px-6 py-3 rounded-full border border-gray-400 focus:border-purple-500 transition"
          />
          <span className="absolute top-5 left-6 text-gray-500">
            {username ? "" : "Full Name"}
          </span>
        </label>
        <label className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="my-2 mx-1 w-[270px] xs:w-[360px] md:w-[450px] px-6 py-3 rounded-full border border-gray-400 focus:border-purple-500 transition"
          />
          <span className="absolute top-5 left-6 text-gray-500">
            {email ? "" : "Email"}
          </span>
        </label>
        <label className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="my-2 mx-1 w-[270px] xs:w-[360px] md:w-[450px] px-6 py-3 rounded-full border border-gray-400 focus:border-purple-500 transition"
          />
          <span className="absolute top-5 left-6 text-gray-500">
            {password ? "" : "Password"}
          </span>
        </label>

        <button
          type="submit"
          className="w-[270px] xs:w-[360px] md:w-[450px] bg-purple-500 hover:bg-purple-700 p-2 text-white text-base rounded-full mt-5"
        >
          Submit
        </button>
        <ToastContainer />
      </form>

      <div className="text-gray-600 mt-5 mb-5 text-center">
        Already have an account?{" "}
        <Link to={"/login"}>
          <span className="text-purple-500 font-medium">Login</span>
        </Link>
      </div>
    </div>
  );
};

export default Register;
