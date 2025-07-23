import React, { useContext, useState } from "react";
import logo from "../assets/logo1.svg";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
const Login = () => {
  let [show, setShow] = useState(false);
  let {userData, setUserData} = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err, setErr] = useState("")

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let result = await axios.post(
        serverUrl + "/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      
       setUserData(result.data);
      navigate("/")
      setLoading(false);
      setEmail("");
      setPassword("");
      setErr("");
    } catch (error) {
      setErr(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col justify-start gap-8 items-center">
      <div className="w-full p-[30px] lg:p-[35px] flex items-center h-[80px]">
        <img src={logo} className="h-8 " alt="logo" />
      </div>
      <form
        onSubmit={handleSignIn}
        className="w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center p-[15px]  gap-[10px]"
      >
        <h1 className="text-gray-800 text-[30px] font-semibold mb-[30px]">
          Sign In
        </h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          required
          className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md"
        />
        <div className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative">
          <input
            type={show ? "text" : "password"}
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md"
          />
          <span
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-[20px] top-[10px] font-bold text-[#066fb0] cursor-pointer "
          >
            {show ? "hidden" : "show"}
          </span>
        </div>
        {err && <p className="text-red-600 text-center">*{err}</p>}
        <button
          disabled={loading}
          className="w-[100%] h-[50px] rounded-full bg-[#066fb0] text-white mt-[40px]"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <p className="text-center" onClick={() => navigate("/signup")}>
          want to create new account ?{" "}
          <span className="text-[#066fb0] cursor-pointer">Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
