import React from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'
import file_upload from '../src/assets/file_upload.png'
import socket from '../component/Socket';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRef } from 'react';


const Message = () => {

    const { id } = useParams(); 
    const { backendUrl } = useContext(ChatContext);
    
    const [friend, setFriend] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [text, setText] = useState('');
    const [imageT, setImage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState('');
    

    //to schrool down
    const messagesEndRef = useRef(null); 

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Get user info and set userId
    const getInfo = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/getInfo`);
            setUserId(response.data.userdetails._id);
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Get the friend list
    const friendList = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/friendList`);
            if (response.data.success) {
                setFriendsList(response.data.friends);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Send message function
    const message = async () => {
        try {
            const formData = new FormData();
            if (imageT || text) {
                formData.append('imageT', imageT);
                formData.append('text', text);
                formData.append('sender', userId);
                formData.append('receiver', id);
                
                const response = await axios.post(`${backendUrl}/api/user/sendText`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                if (response.data.success) {
                    setImage('');
                    setText('');
                    const savedMessage = response.data.newMessage;

                    socket.emit('send-message', savedMessage); 
                    setMessages((prev) => [...prev, savedMessage]); 
                }
            } else {
                toast.error('Please write something');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Get all messages for this conversation
    const getMessage = async () => {
        const sender = userId;
        const receiver = id;

        try {
            const response = await axios.post(`${backendUrl}/api/user/loadMessage`, { sender, receiver });
            if (response.data.success) {
                setMessages(response.data.messages);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };


    //funciton to delete message
    const deleteMessage =async ()=>{
        try{
            const response = await axios.post(`${backendUrl}/api/user/deleteConversation`, { receiver:id });
            if(response.data.success){
                toast.success(response.data.message)
                setMessages([])
            }
        }
        catch(err){
            toast.error(err.message)
        }
    }

    // Listen for new messages via socket
    useEffect(() => {
        if (userId) {
            socket.emit('join', userId); 

            socket.on('received_message', (data) => {
                console.log(data);
                setMessages((prev) => [...prev, data]);
            });

         
            return () => {
                socket.off('received_message');
            };
        }
    }, [userId]);

   

    useEffect(() => {
        getInfo();
        friendList();
    }, []);

  
    useEffect(() => {
        const user = friendsList.find((user) => user._id === id);
        if (user) {
            setFriend(user);
        }
    }, [id, friendsList]);

   
    useEffect(() => {
        if (userId) {
            getMessage();
        }
    }, [userId]);






    return (
         <div className='w-full  h-screen flex flex-col'>
          
           {/* navbar  */}
           <div className='bg-cyan-800 sm:pr-[230px] text-center fixed  sm:py-4 sm:mt-0 px-2 w-full mt-[52px] text-white py-2 text-2xl sm:text-4xl'>
              <div className='flex sm:py-0 sm:mr-0 items-center  justify-between'>
                     <p className='sm:ml-5'>{friend.name}</p>
                     <p onClick={()=>deleteMessage()} className='w-[25%] text-2xl border-2 rounded-md'>Delete </p>
              </div>
           </div>






           {/* texts  */}
           <div className='flex flex-col gap-2 px-3 scrollbar-hide   mb-[80px] py-[10px] overflow-y-auto sm:mt-[92px] mt-[105px]'>
            {messages.length===0 ? (<p className='text-center'>No messages.....</p>): (messages.map((msg, index) => {
                 const isMine = msg.sender === userId;
                     return (
                          <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-3 max-w-[70%] rounded-xl ${ isMine ? 'bg-[#24bab8] text-white' : 'bg-gray-200 text-black'}`}>
                                  {msg.content && <p>{msg.content}</p>}
                                  {msg.image && (<img src={msg.image} className="mt-2 sm:h-[350px] sm:max-w-[700px] max-w-full rounded-md"/>)}
                             </div>
                          </div>
                            );
                  }))
                }
            <div ref={messagesEndRef} />
           </div>


           {/* text area  */}
           <div className='fixed bottom-4 sm:w-[84%] sm:right-4  w-full mb-2 px-2 '>
              <div className='flex items-center  justify-between'>
                <div className='flex w-[86%] sm:w-[94%]  py-2 rounded-4xl pl-1 pr-2 bg-cyan-800  items-center  justify-between'>
                    <label htmlFor="imag" className='cursor-pointer'>
                       <img className='h-[35px]  rounded-[20%]' src={file_upload } alt="" />
                        <input  className='hidden ' id='imag' placeholder='none' type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                    </label>
                   <input value={text} onChange={(e)=>setText(e.target.value)} type="text" className='px-3 mr-1 border-white border-2 text-[22px] bg-white  rounded-3xl py-[2px] outline-none w-[85%]'  placeholder='write something...'/>
                </div>

                <div className='flex justify-center items-center sm:mr-4' >
                   <p onClick={message} className='bg-cyan-800 px-2  py-1 rounded-4xl text-5xl text-white flex justify-center items-center'>+</p>
                </div>

              </div>
              
             
           </div>
        </div>
    );
};

export default Message;

