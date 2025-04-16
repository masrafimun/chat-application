import React, { useContext, useState } from 'react';
import './css/login.css'
import { ChatContext } from '../context/ChatContext';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import socket from '../component/Socket';
//toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

    const [currentState, setCurrentState] = useState('Log In')
    const [name,setName] = useState('')
    const [password,setPassword] = useState('')
    const [email,setEmail] = useState('')
    const [userName,setUserName] = useState('')
    const [otp,setOtp] = useState('')
    const [isDisabled, setIsDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);


    //navigate
    const navigate = useNavigate();

    const {backendUrl,setAuthenticate,setUserId} = useContext(ChatContext)
    
    //sendotp function
    const sendOtp = async () =>{
        const response = await axios.post(backendUrl +'/api/auth/otp',{name,email,password,userName})
        if(response.data.success){
            handleClick()
            toast.success(response.data.message)
        }
        else{
            toast.error(response.data.message)
        }

    }

    //reset otp function
    const resetOtp = async () =>{
        setIsDisabled(false);
        setCountdown(0);
        const response = await axios.post(backendUrl +'/api/auth/reset',{email})
        if(response.data.success){
            toast.success(response.data.message)
            handleClick()
        }
        else{
            toast.error(response.data.message)
        }
    }

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




    const onSubmitHandler = async (event) =>{
        event.preventDefault()

        axios.defaults.withCredentials =true
        
        
        try{
            
            //for sign-up
            if(currentState === 'Sign Up'){
                const response = await axios.post(backendUrl +'/api/auth/verify',{email,otp})
                if(response.data.success){
                    setName('')
                    setPassword('')
                 
                    setEmail('')
                    setOtp('')
                    setUserName('')

                    
                   const responseAuth = await axios.get(backendUrl +'/api/user/auth', {})
                   if(responseAuth.data.success ){
                    setAuthenticate(true)
                    setUserId(responseAuth.data.userId)
                    toast.success(responseAuth.data.success)

                    navigate('/')
                    window.location.reload(); 
                    socket.connect();
                   }


                }
                else{
                    toast.error(response.data.message)
                }
            }
            //for login
            else{
                const response = await  axios.post(backendUrl +'/api/user/login',{email,password})
                if(response.data.success){
                   setPassword('')
                   setEmail('')
                   setUserId(response.data.userId)

                   const responseAuth = await axios.get(backendUrl +'/api/user/auth', {})
                   if(responseAuth.data.success ){
                    setAuthenticate(true)
                    navigate('/')
                    socket.connect();
                   }

                }
                else{
                   toast.error(response.data.message)
                }
            }
        }catch(err){
            toast.error(err.message)
        }
    }
    


    return (
     <div className= 'bg-white h-screen flex justify-center items-center'>
           <form onSubmit={onSubmitHandler} className=" w-full flex flex-col  bg-white items-center pb-4 px-6  sm:max-w-96 gap-4 text-gray-800">
            <div className="inline-flex items-center gap-2 mb-2 mt-10">
                <hr className="border-none h-[3px] w-8 bg-[#24bab8]" />
                <p className="prata-regular text-[#24bab8] text-4xl font-medium">{currentState}</p>
                <hr className="border-none h-[3px] w-8 bg-[#24bab8]" />
            </div>

            {currentState==='Log In' ? '' : <input value={name} onChange={(e) =>setName(e.target.value)} className="w-full px-3 py-2 border border-gray-800" type="text" placeholder="Name " required/>}
            <input onChange={(e) =>setEmail(e.target.value)} value={email} className="w-full px-3 py-2 border border-gray-800" type="email" placeholder="Email " required/>
            <input onChange={(e) =>setPassword(e.target.value)} value={password} className="w-full px-3 py-2 border border-gray-800" type="password" placeholder="Password "required />
            {currentState==='Log In' ? '' :   <input onChange={(e) =>setUserName(e.target.value)} value={userName} className="w-full px-3 py-2 border border-gray-800" type="text" placeholder="User name"required />}
            {currentState==='Log In' ? '' :
              <div className='flex flex-col w-full'>
                <div className='flex justify-between '>
                    <p onClick={() => sendOtp()} className='w-[48%] text-white text-center py-1 text-2xl cursor-pointer bg-[#24bab8]'>Send OTP</p>
                    <p onClick={() => !isDisabled && resetOtp()} className={` text-white text-center py-1 text-2xl w-[48%] ${ isDisabled ? "bg-gray-500  cursor-not-allowed" : "bg-[#24bab8] cursor-pointer"
                       }`}>Reset OTP</p>
                </div>
                {isDisabled && <p className="text-center text-red-600 mt-2">Reset button available in {countdown}s</p>}
              </div>
            }

            {currentState==='Log In' ? '' : <input value={otp} onChange={(e) =>setOtp(e.target.value)} className="w-full px-3 py-2 border border-gray-800" type="text" placeholder="OTP" required/>}


            <button className="bg-[#24bab8] text-2xl w-full text-white font-light px-8 py-2 cursor-pointer">{currentState=== 'Log In' ? 'Log In': 'Sign Up'} </button>

            <div className="w-full flex justify-between text-sm mt-[-8px]">
                <p onClick={()=>navigate('/reset-password')} className="cursor-pointer text-gray-600">Forgot your password</p>
                {currentState==='Log In'? <p onClick={() =>setCurrentState('Sign Up')} className="cursor-pointer text-gray-600">Create an account</p> : <p onClick={() =>setCurrentState('Log In')}className="cursor-pointer">Login here</p>}
            </div>
    
        </form>
     </div>
    );
};

export default Login;