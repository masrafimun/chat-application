import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import profile_image from '../src/assets/Profile.jpg'
import { toast } from 'react-toastify'
import axios from 'axios';
import { useEffect } from 'react';



const People = ({name,email,profilePic,username,receiverId}) => {
    const {backendUrl,userId} = useContext(ChatContext)
    const senderId = userId
    
    const [status,setStatus] = useState(null)


    //function for status
    const checkStatus = async() =>{
        try {
            const response = await axios.post(backendUrl + '/api/user/checkStatus', {senderId,receiverId});
            if (response.data.success) { 
                setStatus(response.data.message)
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    //function for send request 
    const sendreq = async () =>{
        try {
            const response = await axios.post(backendUrl + '/api/user/sendReq', {senderId,receiverId});
            if (response.data.success) { 
                checkStatus()
                toast.success(response.data.message)
            }
        } catch (err) {
            toast.error(err.message);
        }
    }
    // function for cancel request 
    const cancelSendReq = async () =>{
        try {
            const response = await axios.post(backendUrl + '/api/user/cancelSendReq', {senderId,receiverId});
            if (response.data.success) { 
                checkStatus()
                toast.success(response.data.message)
            }
        } catch (err) {
            toast.error(err.message);
        }
    }



    useEffect(()=>{
        checkStatus()
    },[senderId,userId,status])


    
    return (
        <div className='flex items-center justify-between border sm:px-7 sm:py-1 mb-6 '>
            <div className='mr-3 '>
                <img className='h-[120px] w-[105px] sm:border border-r' src={profilePic || profile_image} alt="" />
            </div>
            <div className='flex flex-col gap-1 sm:gap-2  sm:text-[20px]'>
                <p>Name : {name} </p>
                <p className=''>Username :{username} </p>
                <p>Email :{email} </p>
                <p onClick={status === 'Add' ? sendreq :  (status === 'Requested' ? cancelSendReq : null)} className='sm:hidden  bg-cyan-700 text-white text-center rounded-md'>{status}</p>
            </div>
            <div>
                <p onClick={status === 'Add' ? sendreq :  (status === 'Requested' ? cancelSendReq : null)}  className='hidden sm:block bg-cyan-700 text-2xl px-7 py-1 text-white text-center rounded-md'>{status}</p>
            </div>
        </div>
    );
};

export default People;