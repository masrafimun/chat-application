import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import profile_image from '../src/assets/Profile.jpg'


//toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { useState } from 'react';

const Friends = () => {

    const {backendUrl,onlineUsers,userId} = useContext(ChatContext)
    const [friendsList, setFriendsList] = useState([])




        
    const friendList = async() =>{
        try {
            const response = await axios.get(backendUrl + '/api/user/friendList', {});
            if (response.data.success) { 
                setFriendsList(response.data.friends)
            }
        } catch (err) {
            toast.error(err.message);
        }
    }
    // console.log(friendReqList)Unfriend

    //function for acceept rerquest 
    const Unfriend =async (receiverId,senderId) =>{
      try {
           const response = await axios.post(backendUrl + '/api/user/removeFriend', {senderId,receiverId});
           if (response.data.success) { 
              toast.success(response.data.message)
              setFriendsList((currentFrnds) => [...currentFrnds.filter((friend) => friend._id !== senderId)]);
           }
      } 
      catch (err) {
        toast.error(err.message);
     }
    }

    //function to get users active status
    const isOnline = (userId) =>{
        return onlineUsers.includes(userId)
    }


    useEffect(() =>{
        friendList()
    },[])

    return (
        
          <div className='px-4 w-full pt-[28px] sm:pt-0  my-8'>
            <p className=' text-2xl mb-2'>Friends : </p>

            {
            friendsList.length != 0 ? 
              (friendsList.map((user,index) => 
                    <div key={index} className='flex w-full items-center bg-blue-200 border mb-6 '>
                        <div className='mr-3 bg-amber-400 w-[25%]'>
                            <img className='h-[120px] w-[105px]  border-r' src={user.profilePhoto || profile_image} alt="" />
                        </div>
                       
                        <div className='flex w-[80%] flex-col gap-1 pr-2 sm:pr-20'>
                            <p className='text-[18px]'>{user.name}</p>
                            {/* <p className=''>Username :{user.userName} </p> */}
                            <p className='text-[15px]'>{user.email} </p>

                            <div className=' flex'>
                               <p onClick={() =>Unfriend(userId,user._id)}  className='px-4 bg-[#24bab8] text rounded-md cursor-pointer mr-4'>Unfriend</p>
                            <Link to={`/message/${user._id}`}  className='px-4  bg-[#24bab8]  rounded-md  cursor-pointer mr-4'>Messsage</Link>
                            </div>
                            <p   className={`px-4 w-[40%] ${isOnline(user._id) ? 'bg-green-500' : 'bg-gray-400'} text rounded-md cursor-pointer mr-4`}>{isOnline(user._id) ? 'Active' : 'Offline'}</p>
                        </div>
                        <div>
                        </div>
                    </div>
                    )) :( <p className='text-3xl w-full text-red-700 '>No friends found...</p>) 
                     }
                </div>
    );
};

export default Friends;









