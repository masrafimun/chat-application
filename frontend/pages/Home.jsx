import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../component/Header";
import MainMenu from "../component/MainMenu";
import Navbar from "../component/Navbar";
import { ChatContext } from "../context/ChatContext";

const Home = () => {

  // logout
  const {backendUrl, authenticate, setAuthenticate } =
    useContext(ChatContext);
  axios.defaults.withCredentials = true;


  useEffect(() => {
    const authenticateUser = async () => {
      axios.defaults.withCredentials = true;

      try {
        const responseAuth = await axios.get(backendUrl + "/api/user/auth", {});

        if (responseAuth.data.success) {
          setAuthenticate(true);
        }
      } catch (error) {
        setAuthenticate(false);
        console.log(error);
      }
    };
    authenticateUser();
  }, []);
  return !authenticate ? (
    <div>
      <Navbar />
      <Header />
    </div>
  ) : (
    <div className="flex ">
      <MainMenu />
      <Outlet></Outlet>
    </div>
  );
};

export default Home;

