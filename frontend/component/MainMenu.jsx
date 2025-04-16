import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';
import axios from 'axios';
import { toast } from 'react-toastify'
import './css/mainmenu.css'
import socket from './Socket';
import { Link } from 'react-router-dom';

const MainMenu = () => {
    const { backendUrl, setAuthenticate, setUserId } = useContext(ChatContext);
    const [visible, setVisible] = useState(false);

    const logout = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/user/logout', {});
            if (response.data.success) { 
                setAuthenticate(false);
                setUserId(null);
                socket.disconnect();
                toast.success(response.data.message);

            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <>
            {/* Sidebar for large screens */}
            <div className='hidden min-h-screen  sm:block w-[16%] bg-[#24bab8]'>
                <div className="sm:flex min-h-screen text-2xl  flex-col items-start fixed left-0 top-0 gap-4 py-7 font-medium justify-between"> 
                    <ul className='flex flex-col gap-4 w-full pt-2 items-center'>
                        <NavLink to='/profile' className='border-b-2 w-[80%]'>
                            <p className='px-7 mb-3'>Profile</p>
                        </NavLink>
                        <NavLink to='/' className='border-b-2 w-[80%]'>
                            <p className='px-7 mb-3'>Friends</p>
                        </NavLink>
                        <NavLink to='/friend-req' className='w-[80%] border-b-2'>
                            <p className='px-7 mb-3'>Friend Request</p>
                        </NavLink>  
                        <NavLink to='/people' className='w-[80%] border-b-2'>
                            <p className='px-7 mb-3'>Find People</p>
                        </NavLink>
                    </ul>
                    <div className='flex justify-center px-7 mb-10'>
                        <button onClick={logout} className='border-2 border-black px-6 py-1 bg-gray-700 text-white cursor-pointer w-full rounded-md'>Log Out</button>
                    </div>
                </div>
            </div>

            {/* Button to open sidebar on small screens */}
           
           <div className='fixed bg-[#24bab8] left-0 py-4 px-2 top-0 w-full sm:hidden'>
             <div className='w-full flex justify-between text-white text-2xl'>
                <p>CHATAPP</p>
                <button onClick={() => setVisible(true)} className=" border-2 px-2 rounded-md">Menu</button>
             </div>

           </div>

            {/* Sidebar for small screens */}
            <div className={`fixed  top-0  right-0 bottom-0 z-50 bg-slate-100 transition-all duration-300 ease-in-out ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex w-full cursor-pointer items-center gap-4 pt-4'>
                        <Link to={'/'}  className='text-black border-b-2 w-full  pl-6 pb-2'>Back</Link>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 text-black pl-6 border-b' to='/profile'>Profile</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 text-black pl-6 border-b' to='/'>Friends</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 text-black pl-6 border-b' to='/friend-req'>Friend request</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 text-black pl-6 border-b' to='/people'>Find People</NavLink>                    
                </div>
                <div className='flex mt-[10px] w-full bottom-0 right-0 relative cursor-pointer items-center gap-4 py-4'>
                     <button onClick={logout} className=' border-2 border-black px-6 py-1 bg-[#24bab8]  text-white cursor-pointer w-full rounded-md'>Log Out</button>
                </div>
            </div>

        </>
    );
};

export default MainMenu;
