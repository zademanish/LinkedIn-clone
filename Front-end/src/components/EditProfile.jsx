import React, { useContext, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import dp from "../assets/dp.webp";
import { userDataContext } from "../context/UserContext";
import { FiCamera, FiPlus } from "react-icons/fi";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

const EditProfile = () => {
  let { edit, setEdit, userData, setUserData } = useContext(userDataContext);
  let {serverUrl} = useContext(authDataContext);

  let [firstName, setFirstName] = useState(userData.firstName || "");
  let [lastName, setLastName] = useState(userData.lastName || "");
  let [userName, setUserName] = useState(userData.userName || "");
  let [headline, setHeadline] = useState(userData.headline || "");
  let [location, setLocation] = useState(userData.location || "");
  let [gender, setGender] = useState(userData.gender || "");
  let [skills, setSkills] = useState(userData.skills || []);
  let [newSkills, setNewSkills] = useState("");
  let [education, setEducation] = useState(userData.education || []);
  let [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: "",
  });

   let [experience, setExperience] = useState(userData.experience || []);
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
  });

  const profileImage = useRef();
  const coverImage = useRef()

  function addSkill(e) {
    e.preventDefault();
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]);
    }
    setNewSkills("");
  }
  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    }
  }

  function addEducation(e) {
    e.preventDefault();
    if (
      newEducation.college &&
      newEducation.degree &&
      newEducation.fieldOfStudy
    ) {
      setEducation([...education, newEducation]);
    }
    setNewEducation({
      college: "",
      degree: "",
      fieldOfStudy: "",
    });
  }

  function removeEducation(edu) {
    if (education.includes(edu)) {
      setEducation(education.filter((e) => e !== edu));
    }
  }

function addExperience(e) {
    e.preventDefault();
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.description
    ) {
      setExperience([...experience, newExperience]);
    }
    setNewExperience({
      title: "",
      company: "",
      description: "",
    });
  }

  let [frontendProfileImage, setFrontendProfileImage] = useState(userData.profileImage || dp);

   let [backendProfileImage, setBackendProfileImage] = useState(null);

    let [frontendCoverImage, setFrontendCoverImage] = useState(userData.coverImage || null);

   let [backendCoverImage, setBackendCoverImage] = useState(null);

   let [saving, setSaving] = useState(false);



   function removeExperience(exp) {
    if (experience.includes(exp)) {
      setExperience(experience.filter((e) =>e!== exp));
    }
  }

  function handleProfileImage (e){
    let file = e.target.files[0]
    setBackendProfileImage(file)
    setFrontendProfileImage(URL.createObjectURL(file))
  }

  function handleCoverImage (e){
    let file = e.target.files[0]
    setBackendCoverImage(file)
    setFrontendCoverImage(URL.createObjectURL(file))
  }

  const handleSaveProfile = async ()=>{
    setSaving(true);
    try {
      let formdata = new FormData();
      formdata.append("firstName",firstName)
      formdata.append("lastName",lastName)
      formdata.append("userName",userName)
      formdata.append("headline",headline)
      formdata.append("location",location)
      formdata.append("skills",JSON.stringify(skills))
      formdata.append("education",JSON.stringify(education))
      formdata.append("experience",JSON.stringify(experience));

      if(backendProfileImage){
        formdata.append("profileImage",backendProfileImage)
      }
       if(backendCoverImage){
        formdata.append("coverImage",backendCoverImage)
      }

      let result = await axios.put(serverUrl+"/api/user/updateprofile",formdata,{withCredentials:true});
      setUserData(result.data)
      setSaving(false);
      setEdit(false);
    } catch (error) {
      setSaving(false)
      console.log(error);
      
    }
  }


  return (
    <div className="w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center">
      <input type="file" accept="image/*" hidden ref={profileImage} onChange={handleProfileImage}/>
      <input type="file" accept="image/*" hidden ref={coverImage} onChange={handleCoverImage}/>

      <div className="w-full h-full bg-black opacity-[0.5] absolute top-0 left-0 "></div>
      <div className="w-[90%] max-w-[500px] h-[600px] bg-white relative z-[200] shadow-lg rounded-lg p-[10px] overflow-auto">
        <div
          className="absolute right-[20px] top-[20px]  cursor-pointer"
          onClick={() => setEdit(false)}
        >
          <RxCross1 className="text-gray-800 font-bold w-[25px] h-[25px] cursor-pointer" />
        </div>
        <div className="w-full h-[150px] bg-gray-500 rounded-lg mt-[40px] overflow-hidden" onClick={()=>coverImage.current.click()}>
          <img src={frontendCoverImage} alt="" className="w-full" />
          <FiCamera className="absolute right-[25px] top-[60px] w-[25px] h-[25px] text-white cursor-pointer" />
        </div>
        <div className="w-[80px] h-[80px] rounded-full overflow-hidden absolute top-[150px] ml-[20px]" onClick={()=>profileImage.current.click()}>
          <img src={frontendProfileImage} alt="dp" className="w-full h-full"  />
        </div>
        <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[200px] left-[90px] rounded-full flex justify-center items-center cursor-pointer">
          <FiPlus className="text-white" />
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-[20px] mt-[50px]">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="firstName"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
            placeholder="lastName"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
          />{" "}
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            placeholder="userName"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
          />{" "}
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            type="text"
            placeholder="headline"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            placeholder="location"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
          />
          <input
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            type="text"
            placeholder="gender (male/female/other)"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
          />
          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h1 className="text-[19px] font-semibold">Skills</h1>
            {skills && (
              <div className="flex flex-col gap-[10px]">
                {skills.map((skill, index) => (
                  <div
                    className="w-full h-[40px] border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center"
                    key={index}
                  >
                    <span>{skill}</span>
                    <RxCross1
                      className="text-gray-800 font-bold w-[20px] h-[20px] cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-[10px] items-start">
              <input
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                type="text"
                placeholder="add new skill"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
              />
              <button
                onClick={addSkill}
                className=" w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]"
              >
                Add
              </button>
            </div>
          </div>
          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]  rounded-lg">
            <h1 className="text-[19px] font-semibold">Education</h1>
            {education && (
              <div className="flex flex-col gap-[10px]">
                {education.map((edu, index) => (
                  <div
                    className="w-full border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center"
                    key={index}
                  >
                    <div>
                      <div>college: {edu.college}</div>
                      <div>Degree: {edu.degree}</div>
                      <div>Field Of Study: {edu.fieldOfStudy}</div>
                    </div>
                    <RxCross1
                      onClick={() => removeEducation(edu)}
                      className="text-gray-800 font-bold w-[20px] h-[20px] cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-[10px] items-start">
              <input
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                type="text"
                placeholder="college"
                value={newEducation.college}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, college: e.target.value })
                }
              />
              <input
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                type="text"
                placeholder="degree"
                value={newEducation.degree}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, degree: e.target.value })
                }
              />
              <input
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                type="text"
                placeholder="Field of study"
                value={newEducation.fieldOfStudy}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    fieldOfStudy: e.target.value,
                  })
                }
              />
              <button
                onClick={addEducation}
                className=" w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]"
              >
                Add
              </button>
            </div>
          </div>

           <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]  rounded-lg">
            <h1 className="text-[19px] font-semibold">Experience</h1>
            {experience && (
              <div className="flex flex-col gap-[10px]">
                {experience.map((exp, index) => (
                  <div
                    className="w-full border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center"
                    key={index}
                  >
                    <div>
                      <div>title: {exp.title}</div>
                      <div>Company: {exp.company}</div>
                      <div>Description: {exp.description}</div>
                    </div>
                    <RxCross1
                      onClick={() => removeExperience(exp)}
                      className="text-gray-800 font-bold w-[20px] h-[20px] cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-[10px] items-start">
              <input
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                type="text"
                placeholder="title"
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
              />
              <input
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                type="text"
                placeholder="company"
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, company: e.target.value })
                }
              />
              <input
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                type="text"
                placeholder="Description"
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
              />
              <button
                onClick={addExperience}
                className=" w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]"
              >
                Add
              </button>
            </div>
          </div>
          <button disabled={saving} className="w-[100%] h-[50px] rounded-full bg-[#066fb0] text-white mt-[40px]" onClick={()=>handleSaveProfile()}>{saving ?"saving...":"Save Profile"}</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
