/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Button, Form, Card, Navbar } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase.js";
import { ref, onValue } from "firebase/database";

const Login = (props) => {
  const initialValues = { username: "", email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [user, setUser] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // get the user authorization from backend

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const auth = getAuth();
    signInWithEmailAndPassword(
      auth,
      formValues.email,
      formValues.password,
      formValues.username
    )
      .then((userCredential) => {
        const user = userCredential.user.email;
        setFormErrors({ registered: "Login successful!" });
        toast.success("logging in");
        onValue(ref(db, "/Users/Signup/"), (querySnapShot) => {
          querySnapShot.forEach((snap) => {
            if (snap.val().email === user) {
              localStorage.setItem("Name", JSON.stringify(snap.val()));
              window.location.href = "/profile";
            }
          });
        });
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          setFormErrors({ email: "invalid email!" });
        } else if (error.code === "auth/wrong-password") {
          setFormErrors({ password: "wrong password" });
        } else if (error.code === "auth/network-request-failed") {
          alert(
            "network error! please make sure that you have a working network access"
          );
        }
      });
  };
  
  useEffect(() => {
    if (formErrors.length === 0 && isSubmit) {
      //
    }
  }, [formErrors]);

  return (
    <>
      <Navbar
        className="container-fluid nav-bar"
      >
        <Link
          to="/"
          className=" text-black text-decoration-none"
          style={{ margin: "10px" }}
        >
          <img src="logo192.png" alt="logo" className="nav-logo"/>
        </Link>
        <div className="nav-text">
          <Link
            to="/Login"
            className="nav-login"
            style={{ margin: "20px" }}
          >
            Login
          </Link>
          <Link to="/Register" className="nav-register">
            Register
          </Link>
        </div>
      </Navbar>
      <div className="login-card">
        <Card
          className="container"
          style={{ positon: "center", boxShadow: "2px 2px 15px" }}
        >
          <Card.Body>
            <Card.Title className="text-center pb-3">Login</Card.Title>
            <Form className="container" onSubmit={handleSubmit}>
              <Form.Group className="m-1 p-1">
                <Form.Label>Email :</Form.Label>
                <Form.Control
                  className="input"
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  autoComplete="off"
                ></Form.Control>
                <Form.Text style={{ color: "red" }}>
                  {formErrors.email}
                </Form.Text>
                <br />
                <Form.Label>Password :</Form.Label>
                <Form.Control
                  className="input"
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="******"
                  required
                  autoComplete="off"
                ></Form.Control>
                <Form.Text style={{ color: "red" }}>
                  {formErrors.password}
                </Form.Text>
                <br />
                <Button type="submit" variant="primary">
                  Start Chat
                </Button>
                <br />
                <ToastContainer
                  className="toast"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
                <ToastContainer />
              </Form.Group>
              <Form.Text>
                Don&apos;t have an account? <Link to="/Register">Register</Link>
              </Form.Text>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Login;
