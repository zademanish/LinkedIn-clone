import React, { useContext, useEffect, useState } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios';
import { io } from 'socket.io-client';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';


const socket = io("https://linkedin-clone-backend-iogf.onrender.com")

const ConnectionButton = ({userId}) => {
let {serverUrl} = useContext(authDataContext);

let {userData, setUserData} = useContext(userDataContext);

let [status, setStatus] = useState("connect")

let navigate = useNavigate()

    const handleSendConnection = async()=>{
        try {
            let result = await axios.post(`${serverUrl}/api/connection/send/${userId}`,{},{withCredentials:true})

            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

       const handleRemoveConnection = async()=>{
        try {
            let result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`,{withCredentials:true})

            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

     const handleGetStatus = async()=>{
        try {
            let result = await axios.get(`${serverUrl}/api/connection/getstatus/${userId}`,{withCredentials:true})
            setStatus(result.data.status)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        socket.emit("register",userData._id)
        handleGetStatus();

        socket.on("statusUpdate",({updatedUserId,newStatus})=>{
            if(updatedUserId == userId){
                setStatus(newStatus)    
            }
        })

        return ()=>{
            socket.off("statusUpdate")
        }

    },[userId])

    const handleClick = async()=>{
        if(status=="disconnect"){
            await handleRemoveConnection()
        }else if(status=="received"){
            navigate("/network")
        }else{
            await handleSendConnection()
        }
    }


  return (
     <button onClick={handleClick} className=' min-w-[100px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' disabled={status == "pending"}>{status}</button>
  )
}

export default ConnectionButton