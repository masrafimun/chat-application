import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { ChatContext } from '../context/ChatContext';
import axios from 'axios';
import { useState } from 'react';
import profile_image from '../src/assets/Profile.jpg'
import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';


const Profile = () => {

    const [profileImage, setProfileImage] = useState(null);

    const [bio ,setBio] = useState('')
    const [bioDup, setBioDup] =useState('')
  
    const [visiBio,setVisiBio] = useState(true)

 const { backendUrl,myDetails } = useContext(ChatContext);
    


    // to update profile picture
    const uploadProfile = async (file) =>{

    try{
        if(!file){
            return;
        }
        const formData = new FormData()
        formData.append("profileImage",file)
    
        // console.log(formData.get("profileImage")); 

        const response = await axios.post( backendUrl +'/api/user/addProfilePic',formData,{
            headers: { "Content-Type": "multipart/form-data" },
        })
        setProfileImage(response.data.profilePicc)
        toast.success(response.data.message)
        window.location.reload(); 
    }
    catch(err){
        toast.error(err.message)
    }
    
       
        
    } 

    // to add bio
    const addBio = async() =>{
       try{
           if(!bioDup){
               return;
            }
            const response = await axios.post( backendUrl +'/api/user/addBio',{bioDup})
            if(response.data.success){
                setBioDup('')
                toast.success(response.data.message)
            }
        
       }
       catch(err){
        toast.error(err.message )
       }
    }

    //to delete account
    const deleAcoount = async ()=>{
        try{
            const response = await axios.post(`${backendUrl}/api/user/deleteAccount`, {});
            if(response.data.success){
                toast.success(response.data.message)
                window.location.reload(); 

            }
        }
        catch(err){
            toast.error(err.message)
        }
    }


    //getting all information about user
    const getInfo = async () =>{
         
        try{
           const response =await axios.get( backendUrl +'/api/user/getInfo',{})
           if(response.data.success){
             setBio(response.data.userdetails.bio)
           }
           }
        catch(err){
             toast.error(err.message)
        }
        }

    useEffect(() => {

       getInfo()

       
    },[bioDup])
 
    

    return (
        <div className=' px-4 py-4 w-full mt-[68px] sm:mt-0 flex flex-col '>
        
           {/* profile picture  */}
           <label htmlFor="profileImage"  className='flex mb-5 mt-4 justify-center  sm:my-17 sm:mb-11 sm:mt-13'>
              <img className="h-35 w-35 sm:w-40 sm:h-40 rounded-[50%]" src={!myDetails.profilePhoto ? profile_image : myDetails.profilePhoto} alt="" />
              <input id='profileImage' type="file" onChange={(e) => {const file = e.target.files[0]; if(file){uploadProfile(file)} }} hidden/>
           </label>

           <div className='text-3xl sm:my-3 sm:pl-[200px]'>
                <p>Name : {myDetails.name}</p>
           </div>
           <div className='text-2xl my-4  sm:my-5 sm:pl-[200px]'>
                 <p>User Name : {myDetails.userName}</p>
           </div>

           <div className='w-full flex justify-between sm:w-[85%] sm:mt-5  sm:pl-[200px]'>
             <label  className='text-2xl border-2 py-1 px-3 w-[80%]' htmlFor="setBioDup">
                <input onChange={(e) =>setBioDup(e.target.value)} className={!visiBio ? "block outline-none" : "hidden"} type="text" id='setBioDup' placeholder='Your bio...'/>
                <p className={visiBio ? "block" : "hidden"}>{bio}</p>
             </label>
             

             <p onClick={() => {setVisiBio(false);}} className={visiBio ? " w-[18%]  text-white justify-center items-center flex text-3xl bg-[#24bab8]" : "hidden"}>Edit</p>
             <p onClick={() => {addBio(); setVisiBio(true)}} className={!visiBio ? " w-[18%]  text-white justify-center items-center flex text-3xl bg-[#24bab8]" : "hidden"}>Add</p>
           </div>

           <div className='mt-5 sm:pl-[200px]  sm:w-[85%] sm:flex sm:justify-center'>
             <p onClick={()=>deleAcoount()} className='bg-cyan-700 w-full rounded-md py-[5px]  text-white text-2xl sm:text-3xl sm:py-2 text-center'>Delete Account</p>
           </div>
        </div>
    );
};

export default Profile;


// {visiBio  && <div className='flex justify-between mb-5'>
//     <input className='text-2xl py-2 px-2 w-[80%] border-2 outline-none' type="text" value={bioDup} onChange={(e) =>setBioDup(e.target.value) }/>
//      <p className='border-2 w-[15%] text-center flex items-center' onClick={()=>{setVisiBio(false); setBio(bioDup); setBioDup('')}}>Add Bio</p>
//     </div>
//    }
// <div className='flex justify-between text-2xl border-2 py-3 px-3' >
//  <p >{bio} ajencfkacnaec a c aiejcoiajceiojeeickaeico</p>
//  <button className='border-2 px-2' onClick={() =>setVisiBio(true) }>Edit bio</button>
