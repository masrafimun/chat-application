import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';
import socket from "../component/Socket";

                

//creating chat context
export const ChatContext = createContext();


//chat context provider
const ChatContextProvider = (props) => {

      const [authenticate,setAuthenticate] = useState(false)
      const [userId, setUserId] = useState(null);
      const [allUser,setAllUser] = useState([])
      const [search,setSearch] = useState('')
      const [onlineUsers, setOnlineUsers] = useState([]);
      const [friendsList, setFriendsList] = useState([])
      const [allUserDetailts,setAllUserdetails] =useState([])
      const [myDetails,setMyDetails] = useState([])
      
      
      
      

      
     //backend url 
      const backendUrl = import.meta.env.VITE_BACKEND_URL


      //getting all user information
      const getInfoALl = async () =>{
                 
        try{
           const response =await axios.get( backendUrl +'/api/user/getInfoALL',{})
           if(response.data.success){
               setAllUser(response.data.userDetails)
               setAllUserdetails(response.data.userDetails)
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
          setUserId(response.data.userdetails._id)
          setMyDetails(response.data.userdetails)
         }
         }
      catch(err){
           toast.error(err.message)
      }
      }




     useEffect(() => {
         getInfo();
         getInfoALl();
     }, []);


     useEffect(() => {
        if (userId) {
            socket.connect(); 
            socket.emit('user_Id', userId); 
      
            socket.on('get-Users', (users) => {
              setOnlineUsers(users);
            });
      
            // Cleanup socket \
            return () => {
              socket.disconnect();
              socket.off('get-Users');
            };
          }
     }, [userId])


      //context value
      const value = {search,setSearch,backendUrl,authenticate,onlineUsers,setAuthenticate,setUserId,userId,allUser,friendsList, allUserDetailts,setFriendsList,myDetails};
    
      return (
        <ChatContext.Provider value={value}>{props.children}</ChatContext.Provider>
      );
};

export default ChatContextProvider