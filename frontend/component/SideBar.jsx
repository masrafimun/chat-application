import React from 'react';
import { NavLink } from "react-router-dom";
const SideBar = () => {
    return (
        <div className='w-[18%] top-0 fixed min-h-screen border-r-2'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
                <NavLink className='flex items-center gap-3 border border-gray-300 px-3 py-2 rounded-1 mr-2' to='/profile'>
                   <p className='hidden md:block'>Profile</p>
                </NavLink>

                <NavLink className='flex items-center gap-3 border border-gray-300  px-3 py-2 rounded-1 mr-2' to='/'>
                   <p className='hidden md:block'>Friends</p>
                </NavLink>

                <NavLink className='flex items-center gap-3 border border-gray-300 px-3 py-2 rounded-1 mr-2' to='/friend-req'>
                   <p className='hidden md:block'>Friend Request</p>
                </NavLink>
            </div>
            <button>Log Out</button>
        </div>
    );
};

export default SideBar;