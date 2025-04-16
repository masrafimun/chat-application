import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import socket from '../component/Socket';


//toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChatContext } from '../context/ChatContext';

const ResetPassword = () => {

    const [password,setPassword] = useState('')
    const [email,setEmail] = useState('')
    const [otp,setOtp] = useState('')
    const [isDisabled, setIsDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);

    //chat context
    const {backendUrl} = useContext(ChatContext)


    //navigate
    const navigate = useNavigate()

    //onsubmit handler
    const onSubmitHandler =async (event) =>{
        event.preventDefault()

        try{
            const response = await axios.post(backendUrl +'/api/user/changePassword',{email,otp,password})
            if(response.data.success){
                toast.success(response.data.message)
                setPassword('')
                setEmail('')
                setOtp('')
                setIsDisabled(false);
                setCountdown(0);
                navigate('/')
                socket.connect();
            }
           }
        catch(err){
            toast.error(err.message)
        }
    }
    

    //sendt otp function
     const sendOtp =async () =>{
        const response = await axios.post(backendUrl +'/api/user/otp',{email})
        if(response.data.success){
            toast.success(response.data.message)
            handleClick()
        }
        else{
            toast.error(response.data.message)
        }

     }


     //reset otp function
     const resetOtp =async () =>{
        setIsDisabled(false);
        setCountdown(0);
        const response = await axios.post(backendUrl +'/api/user/reset',{email})
        if(response.data.success){
            toast.success(response.data.message)
            handleClick()
        }
        else{
            toast.error(response.data.message)
        }
      

     }

     //function for setreset otp timeline
     const handleClick = () => {
        setIsDisabled(true);
        setCountdown(60); // Set 60 seconds countdown
    
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(interval);
              setIsDisabled(false); // Enable button after countdown
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      };


    return (
        <div className= 'bg-white  h-screen flex justify-center items-center'>
           <form onSubmit={onSubmitHandler} className=" w-full flex flex-col  bg-white items-center pb-4 px-6  sm:max-w-96 mt-14 gap-4 text-gray-800 mb-12">
                <div className="inline-flex items-center gap-2 mb-2 mt-10">
                   <hr className="border-none h-[3px] w-8 bg-[#24bab8]" />
                   <p className="prata-regular text-[#24bab8] text-3xl font-medium">Reset Password</p>
                   <hr className="border-none h-[3px] w-8 bg-[#24bab8]" />
                </div>

                <input onChange={(e) =>setEmail(e.target.value)} value={email} className="w-full px-3 py-2 border border-gray-800" type="email" placeholder="Email " required/>

                <div className='flex flex-col w-full'>
                <div className='flex justify-between '>
                    <p onClick={() => sendOtp()} className='w-[48%] text-white text-center py-1 text-2xl cursor-pointer bg-[#24bab8]'>Send OTP</p>
                    <p onClick={() => !isDisabled && resetOtp()} className={` text-white text-center py-1 text-2xl w-[48%] ${ isDisabled ? "bg-gray-500  cursor-not-allowed" : "bg-[#24bab8] cursor-pointer"
                       }`}>Reset OTP</p>
                </div>
                {isDisabled && <p className="text-center text-red-600 mt-2">Reset button available in {countdown}s</p>}
              </div>

              <input value={otp} onChange={(e) =>setOtp(e.target.value)} className="w-full px-3 py-2 border border-gray-800" type="text" placeholder="OTP" required/>

              <input onChange={(e) =>setPassword(e.target.value)} value={password} className="w-full px-3 py-2 border border-gray-800" type="password" placeholder="Enter new password "required />

            <button className="bg-[#24bab8] text-2xl w-full text-white font-light px-8 py-2 ">Submit</button>


           </form>
     </div>
    );
};

export default ResetPassword;