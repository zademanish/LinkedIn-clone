import React, { useContext, useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { FiCamera, FiPlus } from "react-icons/fi";
import { HiPencil } from "react-icons/hi2";
import { userDataContext } from "../context/UserContext";
import Nav from "../components/Nav";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import EditProfile from "../components/EditProfile";
import Post from "../components/Post";
import ConnectionButton from "../components/ConnectionButton";

const Profile = () => {
  let { userData, setUserData, edit, setEdit, postData, setPostData,profileData,setProfileData } =
    useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);
  let [profilePost, setProfilePost] = useState([]);
  

  

  

  useEffect(() => {
    setProfilePost(postData.filter((post) => post.author._id == profileData._id));
  }, [profileData]);

  return (
    <div className="w-full min-h-[100vh] bg-[#eeeeee] flex flex-col items-center pt-[100px] pb-[40px]">
      <Nav />
      {edit && <EditProfile />}
      <div className="w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px]">
        <div className="relative bg-[white]  rounded shadow-lg pb-[40px]">
          <div
            onClick={() => setEdit(true)}
            className="w-[100%] h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center cursor-pointer relative"
          >
            <img src={profileData.coverImage || null} alt="" className="w-full" />
            <FiCamera className="absolute right-[20px] top-[20px] w-[25px] h-[25px] text-white gray-800 cursor-pointer" />
          </div>
          <div
            className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[65px] left-[35px] cursor-pointer"
            onClick={() => setEdit(true)}
          >
            <img
              src={profileData.profileImage || dp}
              alt="profileImage"
              className=" h-full "
            />
          </div>
          <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[110px] left-[90px] rounded-full flex justify-center items-center cursor-pointer">
            <FiPlus className="text-white" onClick={() => setEdit(true)} />
          </div>
          <div className="mt-[30px] pl-[20px] font-semibold text-gray-700">
            <div className="text-[22px]">{`${profileData.firstName} ${profileData.lastName}`}</div>
            <div className="text-[18px] font-semibold text-gray-700">
              {profileData.headline || ""}
            </div>
            <div className="text-[16px] font-normal text-gray-600">
              {profileData.location}
            </div>
            <div className="text-[16px] font-normal text-gray-600">
              {`${profileData.connection.length} connection`}
            </div>
          </div>
          {profileData._id ==userData._id && 
            <button
            onClick={() => setEdit(true)}
            className=" min-w-[150px] h-[40px] my-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px] ml-[20px]"
          >
            Edit Profile <HiPencil />{" "}
          </button>
          }

          {profileData._id !==userData._id &&
          <div className="ml-[20px] mt-[20px]">
            <ConnectionButton userId={profileData._id}/>
          </div> 
          }
        
        </div>

        <div className="w-full min-h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-[white] shadow-lg">
          {`Post ${profilePost.length}`}
        </div>
        {profilePost.map((post, index) => (
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
        {/* skill */}
        {profileData.skills.length > 0 && 
          <div className="w-full min-h-[100px] flex flex-col justify-center gap-[10px] p-[20px]  font-semibold bg-[white] shadow-lg">
            <div className="text-[22px] text-gray-600">
              Skills
            </div>
            <div className="flex 
             flex-wrap justify-start items-center gap-[20px] text-gray-600 p-[20px]">
            {profileData.skills.map((skill) => (
              <div className="text-[20px]">{skill}</div>
            ))}
            {profileData._id ==userData._id &&
            <button onClick={()=>setEdit(true)} className="min-w-[150px] h-[40px]  rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px] ml-[20px]" >Add Skills</button>
            }
            </div>
          </div>
        }
        {/* eduction  */}

        {profileData.education.length > 0 && 
          <div className="w-full min-h-[100px] flex flex-col justify-center gap-[10px] p-[20px]  font-semibold bg-[white] shadow-lg">
            <div className="text-[22px] text-gray-600">
              Education
            </div>
            <div className="flex 
             flex-col justify-start items-start gap-[20px] text-gray-600 p-[20px]">
            {profileData.education.map((edu) => (
              <>
                <div className="text-[20px]">College: {edu.college}</div>
                 <div className="text-[20px]">Degree: {edu.degree}</div>
                  <div className="text-[20px]">Field Of Study: {edu.fieldOfStudy}</div>
              </>
              
            ))}
            {profileData._id ==userData._id &&
            <button onClick={()=>setEdit(true)} className="min-w-[150px] h-[40px]  rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px] " >Add Education</button>
            }
            </div>
          </div>
        }

        {/* experience */}

         {profileData.experience.length > 0 && 
          <div className="w-full min-h-[100px] flex flex-col justify-center gap-[10px] p-[20px]  font-semibold bg-[white] shadow-lg">
            <div className="text-[22px] text-gray-600">
              Experience
            </div>
            <div className="flex 
             flex-col justify-start items-start gap-[20px] text-gray-600 p-[20px]">
            {profileData.experience.map((ex) => (
              <>
                <div className="text-[20px]">Title: {ex.title}</div>
                 <div className="text-[20px]">Company: {ex.company}</div>
                  <div className="text-[20px]">Description: {ex.description}</div>
              </>
              
            ))}
            {profileData._id ==userData._id &&
            <button onClick={()=>setEdit(true)} className="min-w-[150px] h-[40px]  rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px] " >Add Experience</button>
            }
            </div>
          </div>
        }

      </div>
    </div>
  );
};

export default Profile;
