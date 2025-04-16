import React from 'react';
import axios from 'axios'
import profile_image from '../src/assets/Profile.jpg'
//toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { useEffect } from 'react';
import { useState } from 'react';



const FriendRequest = () => {

    const {backendUrl,userId} = useContext(ChatContext)
    const [friendReqList, setFriendsReqList] = useState([])
      
    //function for friendReq list
    const friendList = async() =>{
        try {
            const response = await axios.get(backendUrl + '/api/user/friendReqList', {});
            if (response.data.success) { 
                setFriendsReqList(response.data.ReqList)
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    //function for acceept rerquest 
    const acceepReq = async (receiverId,senderId) =>{
        try {
            const response = await axios.post(backendUrl + '/api/user/acceptReq', {senderId,receiverId});

            if (response.data.success) { 
                toast.success(response.data.message)
                setFriendsReqList((currentFrndReq) => [...currentFrndReq.filter((friend) => friend._id !== senderId)]);
            }
       
        } catch (err) {
            toast.error(err.message);
        }
    }
    //function for acceept rerquest 
    const rejectReq = async (receiverId,senderId) =>{
        try {
            const response = await axios.post(backendUrl + '/api/user/rejectReq', {senderId,receiverId});

            if (response.data.success) { 
                toast.success(response.data.message) 
                setFriendsReqList((currentFrndReq) => [...currentFrndReq.filter((friend) => friend._id !== senderId)]);
            }
       
        } catch (err) {
            toast.error(err.message);
        }
    }

    useEffect(() =>{
        friendList()
    },[])


    return (
        <div className='px-4  pt-[60px] sm:pt-0 my-8'>
            <p className=' text-3xl mb-4'>Friend requests :</p>

             { 
                friendReqList.length === 0 ? ( <p className='text-3xl w-full text-red-700 '>No friend requests found.....</p>) :
                (friendReqList.map((user,index) => 
                 <div key={index} className='flex items-center justify-between border  mb-6 '>
                            <div className='mr-3 '>
                                <img className='h-[120px] w-[105px]  border-r' src={user.profilePhoto || profile_image} alt="" />
                            </div>
                            <div className='flex flex-col gap-1  sm:pr-20'>
                                <p>Name : {user.name} </p>
                                <p className=''>Username :{user.userName} </p>
                                <p>Email :{user.email} </p>
                                <div className='flex'>
                                    <p onClick={() =>acceepReq(userId,user._id)}  className='px-4 bg-[#24bab8] text rounded-md cursor-pointer mr-4'>Accept</p>
                                    <p onClick={() =>rejectReq(userId,user._id)} className='px-4 bg-[#24bab8] text rounded-md cursor-pointer mr-4'>Reject</p>
                                </div>
                            </div>
                           
                        </div>
            ))
             }
        </div>
    );
};

export default FriendRequest;