import React, { useContext, useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import dp from "../assets/dp.webp";
import { FiCamera, FiPlus } from "react-icons/fi";
import { HiPencil } from "react-icons/hi2";
import { userDataContext } from "../context/UserContext";
import EditProfile from "../components/EditProfile";
import { RxCross1 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import Post from "../components/Post";

const Home = () => {
  let { userData, setUserData, edit, setEdit, postData, setPostData, getPost, handleGetProfile } =
    useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);
  let [uploadPost, setUploadPost] = useState(false);
  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  let [description, setDescription] = useState("");
  let [posting, setPosting] = useState(false);
  let [suggestedUser, setSuggestedUser] = useState([]);

  let image = useRef();

  function handleImage(e) {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }
  async function handleUploadPost() {
    setPosting(true);
    try {
      let formdata = new FormData();
      formdata.append("description", description);
      if (backendImage) {
        formdata.append("image", backendImage);
      }

      let result = await axios.post(serverUrl + "/api/post/create", formdata, {
        withCredentials: true,
      });
      console.log(result);
      setPosting(false);
      setUploadPost(false);
    } catch (error) {
      setPosting(false);
      console.log(error);
    }
  }

  const handleSuggestedUsers = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/suggestedusers", {
        withCredentials: true,
      });
      console.log(result.data);
      setSuggestedUser(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSuggestedUsers();
  }, [uploadPost]);

  useEffect(() => {
    getPost();
  }, [uploadPost]);

  return (
    <div className="w-full min-h-[100vh] bg-[#eeeeee] pt-[100px] flex items-center lg:items-start justify-center gap-[20px] px-[20px] flex-col lg:flex-row relative pb-[50px]">
      {edit && <EditProfile />}
      <Nav />
      {/* left */}
      <div className="w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg rounded-lg p-[10px] relative">
        <div
          onClick={() => setEdit(true)}
          className="w-[100%] h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center cursor-pointer"
        >
          <img src={userData.coverImage || null} alt="" className="w-full" />
          <FiCamera className="absolute right-[20px] top-[20px] w-[25px] h-[25px] text-white gray-800 cursor-pointer" />
        </div>
        <div
          className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[65px] left-[35px] cursor-pointer"
          onClick={() => setEdit(true)}
        >
          <img
            src={userData.profileImage || dp}
            alt="profileImage"
            className=" h-full "
          />
        </div>
        <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[110px] left-[90px] rounded-full flex justify-center items-center cursor-pointer">
          <FiPlus className="text-white" onClick={() => setEdit(true)} />
        </div>
        <div className="mt-[30px] pl-[20px] font-semibold text-gray-700">
          <div className="text-[22px]">{`${userData.firstName} ${userData.lastName}`}</div>
          <div className="text-[18px] font-semibold text-gray-700">
            {userData.headline || ""}
          </div>
          <div className="text-[16px] font-normal text-gray-600">
            {userData.location}
          </div>
        </div>
        <button
          onClick={() => setEdit(true)}
          className=" w-[100%] h-[40px] my-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px]"
        >
          Edit Profile <HiPencil />{" "}
        </button>
      </div>

      {/* middle popup */}
      {uploadPost && (
        <div className="w-full h-full bg-black fixed top-0 opacity-[0.6] left-0 z-[100]"></div>
      )}

      {uploadPost && (
        <div className="w-[90%] max-w-[500px] h-[600px] bg-white shadow-lg rounded-lg fixed z-[200] p-[20px] flex items-start justify-start flex-col gap-[20px]">
          <div className="absolute right-[20px] top-[20px]  cursor-pointer">
            <RxCross1
              onClick={() => setUploadPost(false)}
              className="text-gray-800 font-bold w-[25px] h-[25px] cursor-pointer"
            />
          </div>
          <div className="flex justify-start items-center gap-[10px]">
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center  cursor-pointer">
              <img
                src={userData.profileImage || dp}
                alt="profileImage"
                className=" h-full "
              />
            </div>
            <div className="text-[22px]">{`${userData.firstName} ${userData.lastName}`}</div>
          </div>
          <textarea
            placeholder="what do you want to talk about..? "
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className={`w-full text-[19px] ${
              frontendImage ? "h-[200px]" : "h-[550px]"
            } outline-none border-none p-[10px] resize-none`}
          ></textarea>
          <input type="file" ref={image} hidden onChange={handleImage} />

          <div className="w-full h-[300px] overflow-hidden flex justify-center items-center rounded-lg">
            <img
              src={frontendImage || ""}
              className="h-full rounded-lg cursor-pointer"
            />
          </div>
          <div className="w-full h-[200px] flex flex-col">
            <div className="p-[20px] flex items-center justify-start border-b-2 border-gray-500">
              <BsImage
                onClick={() => image.current.click()}
                className="w-[24px] h-[24px] text-gray-500 cursor-pointer"
              />
            </div>

            <div className="flex justify-end items-center">
              <button
                disabled={posting}
                className="w-[100px] h-[50px] rounded-full bg-[#066fb0] text-white mt-[40px]"
                onClick={handleUploadPost}
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* middle */}

      <div className="w-full lg:w-[50%] bg-[#f0efe7]  min-h-[200px] flex flex-col gap-[20px]">
        <div className="w-full p-[10px] h-[120px] rounded-lg bg-white shadow-lg flex items-center justify-center gap-[10px]">
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center  cursor-pointer">
            <img
              src={userData.profileImage || dp}
              alt="profileImage"
              className=" h-full "
            />
          </div>
          <button
            onClick={() => setUploadPost(true)}
            className="w-[80%] rounded-full h-[60px] border-2 border-gray-300 flex justify-start items-center px-[20px] hover:bg-gray-200"
          >
            start a post
          </button>
        </div>
        {postData.map((post, index) => (
          <Post
            key={index}
            id={post._id}
            description={post.description}
            author={post.author}
            image={post.image}
            like={post.like}
            comment={post.comment}
            createdAt={post.createdAt}
          />
        ))}
      </div>

      {/* right */}
      <div className="w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg rounded-l-md hidden lg:flex flex-col p-[20px]">
        <h1 className="text-[20px] font-semibold text-gray-600">
          Suggested User
        </h1>
        {suggestedUser.length > 0 && (
          <div className="flex flex-col gap-[10px] mt-[10px]">
            {suggestedUser.map((su) => (
              <div className="flex items-center gap-[10px] hover:bg-gray-200  p-[5px]" onClick={()=>handleGetProfile(su.userName)}>
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                  <img
                    src={su.profileImage || dp}
                    alt="dp"
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <div className="text-[19px] font-semibold text-gray-700">
                    {`${su.firstName} `}

                    {` ${su.lastName}`}
                  </div>
                  <div className="text-[12x] font-semibold text-gray-700">
                    {su.headline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {suggestedUser.length == 0 && <div>No Suggested Users</div>}
      </div>
    </div>
  );
};

export default Home;
