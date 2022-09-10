/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Dropdown } from "react-bootstrap";
import {
  PersonCircle,
  ThreeDotsVertical,
  BoxArrowInLeft,
} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase.js";
import { getAuth, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import "../index.css";

const Profile = () => {
  const [user, setUser] = useState("");
  const [allRegisteredUsers, setAll] = useState([]);
  const [foundUsers, setFoundUsers] = useState(allRegisteredUsers);
  const [noRecordFound, setNoRecordFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  // save the loggedIn user into user
  // set logged in user name as title

  useEffect(() => {
    const value = localStorage.getItem("Name");
    const loggedInUser = JSON.parse(value);
    if (loggedInUser) {
      setUser(loggedInUser);
      Data();
    }
  }, []);

  //  getting registered users from firebase 

  const Data = () => {
    var registeredUsers = [];
    return onValue(ref(db, "/users/signup/"), (querySnapShot) => {
      querySnapShot.forEach((snap) => {
        registeredUsers.push(snap.val());
      });
      setAll(registeredUsers);
      setLoading(false);
    });
  };

  // filter for search list

  const filter = (e) => {
    e.preventDefault();
    const keyword = e.target.value;
    if (keyword !== "") {
      const results = allRegisteredUsers.filter((user) => {
        return user.username.toLowerCase().startsWith(keyword.toLowerCase());
      });
      if (results.length === 0) {
        setNoRecordFound(true);
      } else {
        setNoRecordFound(false);
      }
      setFoundUsers(results);
    } else {
      setFoundUsers([]);
      setNoRecordFound(false);
    }
  };
  //   signout and clear localstorage 

  const logout = () => {
    toast.warning("logging out");
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        const valueClear = localStorage.getItem("Name");
        localStorage.clear(valueClear);
        navigate("/login");
      })
      .catch((error) => {
        alert(error);
      });
  };

  // show/close modal

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={handleClose}>
            cancel
          </Button>
          <Button variant="primary" onClick={logout}>
            logout
          </Button>
          <ToastContainer
            className="toast"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <ToastContainer />
        </Modal.Footer>
      </Modal>

      <div id="profile-header">
        <Form.Group className="container-fluid overflow-hidden bg-secondary">
          <div id="profile-head">
            <div>
              <h3 id="profile-name">{user.username}</h3>
            </div>
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  <ThreeDotsVertical id="dropdown-icon" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item type="submit" className="dropdown-items" onClick={handleShow}>
                    <BoxArrowInLeft /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Form.Group>
        
        <Form.Group className="container-fluid bg-secondary p-2">
          <Form.Control
            id="profile-search"
            className="container"
            type="search"
            placeholder="Search..."
            onChange={filter}
          ></Form.Control>

          <div className="user-list">
            {foundUsers && foundUsers !== "" ? (
              foundUsers.map((user) => (
                <Form.Group
                  className="container mt-5px list-group"
                  key={user.email}
                ></Form.Group>
              ))
            ) : (
              <></>
            )}
          </div>
        </Form.Group>
        <br />
      </div>
      <div >
        <Form.Group className="container-fluid mt-10 list-group">
          {foundUsers && foundUsers.length > 0 ? (
            foundUsers.map((user) => (
              <Link
                className="list-group-item list-group-item-action list-group-item-light m-1"
                to={"/messages/" + user.uid}
                key={user.username}
                state={user}
              >
                <PersonCircle 
                  className="m-2" color="grey" size={40} 
                />
                {user.username}
              </Link>
            ))
          ) : noRecordFound ? (
            <div className="text-center">No record found!</div>
          ) : (
            <></>
          )}
          {loading ? (
            <>
              <div className="d-flex justify-content-center ">
                <div className="spinner-border"></div>
              </div>
            </>
          ) : foundUsers &&
            foundUsers.length === 0 &&
            allRegisteredUsers &&
            allRegisteredUsers.length > 0 &&
            !noRecordFound ? (
              <div id="profile-users">
                {allRegisteredUsers
                  .filter((a) => a.uid !== user.uid)
                  .map((allUsers, key) => (
                    <Link
                      to={"/messages/" + allUsers.uid}
                      key={allUsers.username}
                      state={allUsers}
                      className="list-group-item list-group-item-action list-group-item-light m-1"
                      id="allUsers"
                      href="http://localhost:3000/messages"
                    >
                      <PersonCircle 
                        className="m-2" color="grey" size={40} 
                      />
                      {allUsers.username}
                    </Link>
                  ))}
              </div>
            ) : (
              <></>
            )}
        </Form.Group>
      </div>
    </>
  );
};

export default Profile;
