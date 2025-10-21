import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createAccount } from "../Redux/Slice/AuthSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: ""
  })

  function handleUserInput(e: { target: { name: any; value: any; }; }) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value
    })
  }

  function getImage(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];

    if (uploadedImage) {
      setSignupData({
        ...signupData,
        avatar: uploadedImage
      })

      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        if (typeof fileReader.result === "string") {
          console.log(fileReader.result);
          setPreviewImage(fileReader.result);
        }
      });
    }
  }

  async function createNewAccount(e) {
    e.preventDefault();

    if (!signupData.name || !signupData.email || !signupData.password || !signupData.avatar) {
      toast.error("Fill all the details");
      return;
    }

    // checking name field length
    if (signupData.name.length < 5) {
      toast.error('Name field must have atleast 5 charatcer');
      return;
    }

    // checking email validation
    if (!signupData.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      toast.error("Invalid email id");
      return;
    }

    // checking password validation
    if (!signupData.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)) {
      toast.error("Password should be 6 to 16 character with a number and special character");
      return;
    }

    const formData = new FormData();
    formData.append('name', signupData.name);
    formData.append('email', signupData.email);
    formData.append('password', signupData.password);
    formData.append('avatar', signupData.avatar);

    // dispatch create account action

    const response = await dispatch(createAccount(formData));

    if (response?.payload?.success) {
      navigate('/');
    }

    setSignupData({
      name: '',
      email: '',
      password: '',
      avatar: ''
    })

    setPreviewImage('');
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh] overflow-x-auto">
        <form noValidate onSubmit={createNewAccount} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
          <h1 className="text-center text-2xl font-bold">Registration page</h1>
          <label htmlFor="image_uploads" className="cursor-pointer">
            {previewImage ? (
              <img src={previewImage} alt="" className="w-24 h-24 rounded-full m-auto" />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>
          <input
            onChange={getImage}
            type="file"
            className="hidden"
            id="image_uploads"
            accept=".jpg, .jpeg, .png"
            name="image_uploads"
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-semibold">Full Name</label>
            <input
              type="text"
              required
              name="name"
              id="name"
              value={signupData.name}
              placeholder="Enter your Full Name"
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">Email</label>
            <input
              type="email"
              required
              name="email"
              id="email"
              value={signupData.email}
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
              value={signupData.password}
              placeholder="Enter your password"
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
            />
          </div>
          <button className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-md py-2 font-semibold text-lg mt-2 cursor-pointer">
            Create Account
          </button>
          <p className="text-center">Already have an account ? <Link className="link text-accent" to={"/login"}>Login</Link></p>
        </form>
      </div>
    </HomeLayout>
  )
}

export default Signup;