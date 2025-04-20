import React from 'react';
import chatbot from '../src/assets/chatbot.png'
import { useNavigate } from 'react-router-dom';
import '../pages/css/login.css'
const Header = () => {

    const navigate = useNavigate()
    return (
        <div className='flex flex-col py-7  items-center text-center  mt-16  sm:mt-40'>
            <img className=' h-[170px]' src={chatbot} alt="" />
            <h1 className='text-3xl sm:text-4xl font-medium mb-7 text-[#24bab8]'>Welcome to our chat app</h1>
            <button onClick={()=>navigate('/login')} className='font-medium py-2 sm:py-3 text-white border-2 text-2xl  rounded-full px-10 sm:px-12 bg-[#24bab8]'>Get Started</button>
        </div>
    );
};

export default Header;
