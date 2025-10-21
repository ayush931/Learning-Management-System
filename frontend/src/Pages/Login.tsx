import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { loginAccount } from "../Redux/Slice/AuthSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  })

  function handleUserInput(e: { target: { name: any; value: any; }; }) {
    const { name, value } = e.target;
    setloginData({
      ...loginData,
      [name]: value
    })
  }

  async function onLoginAccount(e) {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Fill all the details");
      return;
    }

    // checking email validation
    if (!loginData.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      toast.error("Invalid email id");
      return;
    }

    // checking password validation
    if (!loginData.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)) {
      toast.error("Password should be 6 to 16 character with a number and special character");
      return;
    }

    // dispatch create account action

    const response = await dispatch(loginAccount(loginData));
    console.log(response)

    if (response?.payload?.success) {
      navigate('/');
    }

    setloginData({
      email: '',
      password: '',
    })
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh] overflow-x-auto">
        <form noValidate onSubmit={onLoginAccount} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
          <h1 className="text-center text-2xl font-bold">Login page</h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">Email</label>
            <input
              type="email"
              required
              name="email"
              id="email"
              value={loginData.email}
              onChange={handleUserInput}
              placeholder="Enter your email"
              className="bg-transparent px-2 py-1 border"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">Password</label>
            <input
              type="password"
              required
              name="password"
              id="password"
              value={loginData.password}
              placeholder="Enter your password"
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
            />
          </div>
          <button className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-md py-2 font-semibold text-lg mt-2 cursor-pointer">
            Login Account
          </button>
          <p className="text-center">Did'nt have an account ? <Link className="link text-accent" to={"/signup"}>Signup</Link></p>
        </form>
      </div>
    </HomeLayout>
  )
}

export default Login;