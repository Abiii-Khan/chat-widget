/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Link, useNavigate} from "react-router-dom";
import React, { useState} from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Button, Form, Card, Navbar } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase.js";
import { ref, onValue } from "firebase/database";
import FormInput from "./FormInput.jsx";

const Login = (props) => {
  const initialValues = {email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [user, setUser] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  // set the user filled data values in formValues

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
    // user logged in successfully, directed to profile page
      .then((userCredential) => {
        const user = userCredential.user.email;
        toast.success("logging in");
        onValue(ref(db, "/users/signup/"), (querySnapShot) => {
          querySnapShot.forEach((snap) => {
            if (snap.val().email === user) {
              localStorage.setItem("Name", JSON.stringify(snap.val()));
              navigate("/profile");
            }
          });
        });
      })
      // errors defined
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
  

  return (
    <>
      <Navbar
        className="container-fluid nav-bar"
      >
        <Link
          to="/"
          className=" text-black text-decoration-none m-2"
        >
          <img src="logo192.png" alt="logo" className="nav-logo"/>
        </Link>
        <div className="nav-text">
          <Link
            to="/login"
            className="nav-login mx-4"
          >
            Login
          </Link>
          <Link to="/register" className="nav-register mx-3">
            Register
          </Link>
        </div>
      </Navbar>
      <div className="login-card-main">
        <Card
          className="container login-card-inner"
        >
          <Card.Body>
            <Card.Title className="text-center pb-3">Login</Card.Title>
            <Form className="container" onSubmit={handleSubmit}>
              <Form.Group className="m-1 p-1">
                <FormInput
                  label={"Email :"}
                  inputProps={{
                    className:"input",
                    type:"email",
                    name:"email",
                    value:formValues.email,
                    onChange:handleChange,
                    placeholder:"example@email.com",
                    required: true,
                    autoComplete:"off"
                  }}
                  error={formErrors.email}
                  errorText={{
                    className: "text-danger"
                  }}
                />
                <br />
                <FormInput
                  label={"Password :"}
                  inputProps={{
                    className:"input",
                    type:"password",
                    name:"password",
                    value:formValues.password,
                    onChange:handleChange,
                    placeholder:"******",
                    required: true,
                    autoComplete:"off"
                  }}
                  error={formErrors.password}
                  errorText={{
                    className: "text-danger"
                  }}
                />
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
                Don&apos;t have an account? <Link to="/register">Register</Link>
              </Form.Text>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Login;
