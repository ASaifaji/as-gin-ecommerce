import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../lib/api.js";

const initialState = {
  login: "",
  password: "",
};

const login = () => {
  const [Data, setData] = useState(initialState);
  const { password, login } = Data;
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (login === "") {
      toast.error("Email-id is required!");
    } else if (password === "") {
      toast.error("password is required!");
    } else {
      try {
        const res = await api.post("login.php", { login, password });
        if (res.data.status === "success") {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        navigate("/");
        } else {
          toast.error(res.data.message || "login gagal!");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "login gagal!");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="flex items-center justify-between text-purple-500 font-bold m-5 p-1">
        <Link to={"/register"}>
          <div className="cursor-pointer flex items-center text-xs">
            <MdArrowBackIos />
            Back to register
          </div>
        </Link>
        <div className="cursor-pointer text-xs">Need any help?</div>
      </div>

      <h1 className="text-2xl text-gray-800 text-center font-medium mt-10 p-2">
        login
      </h1>
      <p className="text-gray-500 leading-5 text-center mb-2">
        Sign-in to continue
      </p>

      <form
        onSubmit={handlesubmit}
        className="flex flex-col justify-center items-center"
      >
        <label className="relative">
          <input
            type="text"
            name="login"
            value={login}
            id="login"
            onChange={handleChange}
            className="my-2 mx-1 w-[270px] h-[30] xs:w-[360px] xs:h-[40px] md:w-[450px] md:h-[50px] px-6 py-3 rounded-full outline-none border-[1px] border-gray-400 focus:border-purple-500 transition duration-200"
          />
          <span className="absolute top-5 text-gray-500 left-0 mx-6 px-2 transition duration-300 input-text">
            {login ? "" : "Email"}
          </span>
        </label>
        <label className="relative">
          <input
            type="password"
            name="password"
            value={password}
            id="password"
            onChange={handleChange}
            className="my-2 mx-1 w-[270px] h-[30] xs:w-[360px] xs:h-[40px] md:w-[450px] md:h-[50px] px-6 py-3 rounded-full outline-none border-[1px] border-gray-400 focus:border-purple-500 transition duration-200"
          />
          <span className="absolute w-[80px] top-5 text-gray-500 left-0 mx-6 px-2 transition duration-300 input-text">
            {password ? "" : "password"}
          </span>
        </label>
        <button
          type="submit"
          className="w-[270px] h-[30] xs:w-[360px] xs:h-[40px] md:w-[450px] md:h-[50px] p-2 md:p-0  bg-purple-700 text-white text-base font-medium md:font-semibold rounded-full mt-5 md:mt-4"
        >
          Submit
        </button>
      </form>
      <ToastContainer />

      <div className="text-gray-600 mt-5 mb-5 text-center">
        Don't have an account?{" "}
        <Link to={"/register"}>
          <span className="text-purple-500 font-medium">Register here</span>
        </Link>
      </div>
    </div>
  );
};

export default login;
