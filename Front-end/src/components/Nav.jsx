import React, { useContext, useEffect, useState } from 'react'
import logo from "../assets/logo.png"
import dp from "../assets/dp.webp"
import {IoSearchSharp,IoNotificationsSharp} from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import {userDataContext} from "../context/UserContext"
import { authDataContext } from '../context/AuthContext';
import {useNavigate} from "react-router-dom"
import axios from 'axios';
const Nav = () => {
    let [activeSearch, setActiveSearch] = useState(false);
    let {userData, setUserData,handleGetProfile} = useContext(userDataContext);
    let [showPopup, setShowPopup] = useState(false);
    let navigate = useNavigate()
    let {serverUrl} = useContext(authDataContext);
    let [searchInput, setSearchInput] = useState()
    let [searchData,setSearchData] = useState("")

    const handleSignOut = async ()=>{
        try {
            let result = await axios.get(serverUrl+"/api/auth/logout", {withCredentials:true});
            setUserData(null);
            navigate("/login")
            console.log(result);
        } catch (error) {
            console.log(error);
            
        }
    }

    const handleSearch = async()=>{
        try {
            let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`,{withCredentials:true})
            setSearchData(result.data);
        } catch (error) {
            setSearchData([])
            console.log(error)
        }
    }

    useEffect(()=>{
            handleSearch()
    },[searchInput])


  return (
    <div className='w-full h-[80px] bg-[white] fixed top-0 shadow-lg flex  justify-between md:justify-around items-center px-[10px] left-0 z-[80]'>
        <div className='flex justify-center items-center gap-[10px]'>
            <div onClick={()=>{setActiveSearch(false)
             navigate("/")}}
                >
            <img src={logo} alt="logo" className='w-[50px]' />
        </div>

        {
            !activeSearch &&  <div><IoSearchSharp onClick={()=>setActiveSearch(true)} className='w-[23px] h-[23px] text-gray-600 lg:hidden'/></div>
        }

        {searchData.length > 0 && 
    <div className='absolute h-[500px] overflow-auto top-[90px] left-[0px] lg:left-[20px] w-[100%] lg:w-[700px] bg-white shadow-lg rounded flex flex-col gap-[20px] p-[20px]'>
        {
            searchData.map((sea)=>(
                <div className='flex gap-[20px] items-center border-b-2 border-b-gray-300 p-[10px] hover:bg-gray-200 cursor-pointer rounded-lg' onClick={()=>handleGetProfile(sea.userName)}>
                     <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
                <img src={sea.profileImage || dp} alt='dp' className='w-full h-full' />
            </div>

            <div>
                  <div className='text-[19px] font-semibold text-gray-700'>
                {`${sea.firstName } `}

                { ` ${sea.lastName}`}
          </div>
          <div className='text-[15x] font-semibold text-gray-700'>{sea.headline}</div>
            </div>
                </div>
            ))
        }
    </div>
        }

        <form className={`w-[190px] lg:w-[350px] h-[40px] bg-[#eeeeee] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${!activeSearch ? 'hidden' :'flex'}`}>
    <div><IoSearchSharp className='w-[23px] h-[23px] text-gray-600'/></div>
    <input onChange={(e)=>setSearchInput(e.target.value)} value={searchInput} type='text' className='w-[80%] h-full bg-transparent outline-none border-0' placeholder='search users...'/>
        </form>
        </div>

{/* right side */}


        <div className='flex justify-center items-center gap-[20px] '>
            {/* pop up div */}
            {showPopup && <div className='w-[300px] main-h-[300px] bg-white shadow-lg absolute top-[75px] right-[20px] lg:right-[100px] rounded-lg flex flex-col items-center p-[20px] gap-[20px]'>

         <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
                <img src={userData.profileImage || dp} alt='dp' className='w-full h-full' />
            </div>
            <div className='text-[19px] font-semibold text-gray-700'>
                {`${userData.firstName } `}

                { ` ${userData.lastName}`}
            </div>

            <button className=' w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={()=>handleGetProfile(userData.userName)}>View Profile</button>
      <div className='bg-gray-700 w-full h-[1px] '></div>
      
        <div className='flex w-full justify-start items-center text-gray-600 gap-[10px] cursor-pointer' onClick={()=>navigate("/network")}>
                <FaUserGroup className='w-[23px] h-[23px] text-gray-600'/>
                <div>My Network</div>
            </div>
             <button className=' w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545]' onClick={handleSignOut}>Sign Out</button>
            </div>  }
         



            <div className='lg:flex flex-col justify-center items-center text-gray-600 hidden cursor-pointer' onClick={()=>navigate("/")}><TiHome className='w-[23px] h-[23px] text-gray-600'/>
            <div>
                Home
            </div>
            </div>
            <div className='md:flex flex-col justify-center items-center text-gray-600 hidden cursor-pointer' onClick={()=>navigate("/network")}>
                <FaUserGroup className='w-[23px] h-[23px] text-gray-600 cursor-pointer'/>
                <div>My Network</div>
            </div>
            <div className='flex flex-col justify-center items-center text-gray-600 cursor-pointer' onClick={()=>navigate("/notification")}>
    <IoNotificationsSharp className='w-[23px] h-[23px] text-gray-600'/>
    <div className='hidden md:block'>
        Notification
    </div>
            </div>
            <div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer' onClick={()=>setShowPopup(prev=>!prev)}>
                <img src={userData.profileImage || dp} alt='dp' className='w-full h-full' />
            </div>
        </div>
    </div>
  )
}

export default Nav