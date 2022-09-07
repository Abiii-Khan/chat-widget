/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./user-info/Login.jsx";
import Register from "./user-info/Registration.jsx";
import app from "./firebase";
import Profile from "./user-info/Profile.jsx";
import Messages from "./user-info/Messages.jsx";
import Home from "./Home.js";
import "./index.css";

const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const value = localStorage.getItem("Name");
    const loggedInUser = JSON.parse(value);
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="profile"
            element={
              user ? (
                <Profile />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="messages/:id"
            element={
              user ? (
                <Messages />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="*"
            element={
              <main className="p-3 text-center">
                <h1>
                  <strong className="text-danger">404 </strong>page not found!
                </h1>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
