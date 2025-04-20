import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/css/login.css'

const Navbar = () => {

    const navigate = useNavigate()

    return (
         <div className='bg-[#24bab8]  w-full sm:hidden  flex justify-center sm:justify-between items-center px-2 sm:px-8 py-1'>
            <h1 className='text-3xl py-1 sm:py-0 text-white font-medium '>CHATAPP</h1>
            <button onClick={() => navigate('/login')} className='text-2xl hidden sm:block  border-2 text-black border-black  bg-gray-100 px-6 py-2 rounded-full hover:bg-white' >Login</button>
        </div>
    );
};

export default Navbar;

// bg-[#06679d]
