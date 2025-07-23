import React, { useContext, useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import moment from "moment";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";

import { FaRegCommentDots } from "react-icons/fa";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { socket, userDataContext } from "../context/UserContext";

import ConnectionButton from "./ConnectionButton";


const Post = ({ id, author, like, comment, description, image, createdAt }) => {

  let [more, setMore] = useState(false);
  let { serverUrl } = useContext(authDataContext);
  let { userData, setUserData, getPost,handleGetProfile } = useContext(userDataContext);
  let [likes, setLikes] = useState([]);
  let [commentContent, setCommentContent] = useState("");
  let [comments, setComments] = useState([]);
  let[showComment, setShowcomment] = useState(false)

  const handleLike = async () => {
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, {
        withCredentials: true,
      });
      setLikes(result.data.like);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      let result = await axios.post(
        serverUrl + `/api/post/comment/${id}`,
        { content: commentContent },
        {
          withCredentials: true,
        }
      );
      setComments(result.data.comment);
      setCommentContent("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    socket.on("likeUpdated",({postId, likes})=>{
      if(postId==id){
        setLikes(likes)
      }
    })

      socket.on("commentAdded",({postId, comm})=>{
      if(postId==id){
        setComments(comm)
      }
    })

    return ()=>{
      socket.off("likeUpdated")
      socket.off("commentAdded")
    }
  },[id])

  useEffect(()=>{
    setLikes(like)
    setComments(comment)
  },[like,comment])

  
  return (
    <div className="w-full min-h-[200px] flex flex-col gap-[10px] bg-white rounded-lg shadow-lg p-[20px]">
      <div className="flex justify-between items-center">
        <div onClick={()=>handleGetProfile(author.userName)} className="flex justify-center items-start gap-[10px]">
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center  cursor-pointer">
            <img src={author.profileImage || dp} className=" h-full " />
          </div>
          <div>
            <div className="text-[22px] font-bold">{`${author.firstName} ${author.lastName}`}</div>
            <div className="text-[16px]">{author.headline}</div>
            <div className="text-[16px]">{moment(createdAt).fromNow()}</div>
          </div>
        </div>
        <div>

        {userData._id != author._id && 
        
          <ConnectionButton userId={author._id}/>
        }

        </div>
      </div>
      <div
        className={`w-full ${
          !more ? "max-h-[100px] overflow-hidden " : ""
        }pl-[50px] `}
      >
        {description}
      </div>
      <div
        className="pl-[50px] text-[19px] font-semibold cursor-pointer"
        onClick={() => setMore((prev) => !prev)}
      >
        {more ? "read less..." : "read more..."}
      </div>
      {image && (
        <div className="w-full h-[300px] overflow-hidden flex justify-center rounded-lg">
          <img src={image} alt="" className="h-full rounded-lg" />
        </div>
      )}
      <div>
        <div className="w-full flex justify-between items-center p-[20px] border-b-2 border-gray-500">
          <div className="flex items-center justify-center gap-[5px] text-[18px]">
            <BiLike className="text-[rgb(30,187,255)] w-[20px] h-[20px]" />
            <span>{likes.length}</span>{" "}
          </div>
          <div className="flex items-center justify-center gap-[5px] text-[18px] cursor-pointer" onClick={()=>setShowcomment(prev=>!prev)}>
            <span>{comment.length}</span> <span>comment</span>
          </div>
        </div>

        <div className="flex justify-start items-center w-full p-[20px] gap-[20px]">
          {!likes.includes(userData._id) && (
            <div
              onClick={handleLike}
              className="flex justify-center items-center gap-[5px] cursor-pointer"
            >
              <BiLike className="w-[24px] h-[24px]" />

              <span>Like</span>
            </div>
          )}

          {likes.includes(userData._id) && (
            <div
              onClick={handleLike}
              className="flex justify-center items-center gap-[5px] cursor-pointer"
            >
              <BiSolidLike className="w-[24px] h-[24px] text-[#07a4ff]" />

              <span className="text-[#07a4ff] font-semibold">Liked</span>
            </div>
          )}

          <div className="flex justify-center items-center cursor-pointer gap-[5px]" onClick={()=>setShowcomment(prev=>!prev)}>
            <FaRegCommentDots className="w-[24px] h-[24px]" />
            <span>comment</span>
          </div>
        </div>

        {
          showComment && 
        <div>
          <form
            onSubmit={handleComment}
            className="border-b-gray-300 border-b-2 w-full flex justify-between items-center p-[10px]"
          >
            <input
              onChange={(e) => setCommentContent(e.target.value)}
              type="text"
              placeholder="leave a comment"
              value={commentContent}
              className="outline-none  border-none"
            />
            <button>
              <LuSendHorizontal className="w-[22px] h-[22px] text-[#07a4ff]" />
            </button>
          </form>
          <div className="flex flex-col gap-[10px]">
            {comments.map((com) => (
              <div className="flex flex-col gap-[10px] border-b-2 border-b-gray-300 p-[20px]">
                <div className="w-full flex justify-start items-center gap-[10px]">
                  <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center  cursor-pointer">
                    <img
                      src={com.user.profileImage || dp}
                      className=" h-full "
                    />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold">
                      {`${com.user.firstName} ${com.user.lastName}`}
                      {/* <div>{moment(com.createdAt).fromNow()}</div> */}
                    </div>
                  </div>
                </div>
                <div className="pl-[50px]">{com.content}</div>
              </div>
            ))}
          </div>
        </div>
        }
      </div>
    </div>
  );
};

export default Post;
