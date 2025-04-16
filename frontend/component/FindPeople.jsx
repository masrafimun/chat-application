import React from 'react';
import SearchBar from './SearchBar';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import People from './People';
import { useEffect } from 'react';
import { useState } from 'react';


//toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FindPeople = () => {
      const {userId,allUser} = useContext(ChatContext);
      const [peopleSearch, setPeopleSearch] = useState('');
      const [filteredUsers, setFilteredUsers] = useState([]);
 




      useEffect(()=>{

        if(peopleSearch.trim() ===''){
            setFilteredUsers(allUser.filter(user => user._id != userId));
        }
        else{
            const filtered = allUser.filter(user =>user._id !==userId && user.name.toLowerCase().includes(peopleSearch.toLowerCase())) 
            setFilteredUsers(filtered);

        }
      },[peopleSearch,allUser])
    return (
        <div className=' w-full mt-[68px] sm:mt-0'>
           <SearchBar search={peopleSearch} setSearch={setPeopleSearch} placeholder="Search people..." />
          <div className='px-4 pt-[60px] sm:pt-[80px] sm:px-[250px] my-8'>
               {
                 filteredUsers.map((item,index) => <People receiverId={item._id} key={index} name={item.name} email={item.email} profilePic={item.profilePhoto} username={item.userName}/>)
               }
           </div>
        </div>
    );
};

export default FindPeople;


