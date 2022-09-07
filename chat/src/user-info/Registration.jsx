/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Button, Form, Card, Navbar } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDatabase, ref, set } from "firebase/database";

const Register = () => {
  const initialValues = { username: "", email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  // set the user filled data values in formValues

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // set/post user data in backend

  const postUserData = async (user) => {
    const db = getDatabase();
    set(ref(db, "Users/Signup/" + user), {
      username: formValues.username,
      email: formValues.email,
      password: formValues.password,
      uid: user,
    });
  };

  // saving the user details for email/password auth
  // after the creation of account

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, formValues.email, formValues.password)
    // account created successfully, directed to login page
      .then((userCredential) => {
        setFormErrors({ registered: "Account created successfully!" });
        toast.success("Account created successfully!");
        if (userCredential?.user?.uid) {
          postUserData(userCredential.user.uid);
          window.location.href = "/login";
        }
        console.log(formValues);
        setFormValues(initialValues);
      })
      // errors defined
      .catch((error) => {
        if (error.code === "auth/internal-error") {
          alert("Please fill all the fields");
        } else if (error.code === "auth/email-already-in-use") {
          setFormErrors({
            email: "email already in use",
          });
        } else if (error.code === "auth/invalid-email") {
          setFormErrors({ email: "invalid email!" });
        } else if (error.code === "auth/network-request-failed") {
          alert(
            "network error! please make sure that you have a working network access"
          );
        } else if (error.code === "auth/invalid-password") {
          setFormErrors({ password: "invalid password!" });
        } else if (error.code === "auth/weak-password") {
          setFormErrors({
            password: "Password should atleast 6 characters",
          });
        }
      });
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      //
    }
  });

  return (
    <>
      <Navbar className="container-fluid nav-bar">
        <Link
          to="/"
          className=" text-black text-decoration-none m-2"
        >
          <img src="logo192.png" alt="logo" className="nav-logo" />
        </Link>
        <div className="nav-text">
          <Link to="/login" className="nav-login mx-4">
            Login
          </Link>
          <Link to="/register" className="nav-register mx-3">
            Register
          </Link>
        </div>
      </Navbar>
      <div className="register-card-main">
        <Card
          className="container register-card-inner"
        >
          <Card.Body>
            <Card.Title className="text-center pb-3">Sign Up</Card.Title>
            <Form className="container" onSubmit={handleSubmit}>
              <Form.Group className="m-1 p-1">
                <Form.Label>username :</Form.Label>
                <Form.Control
                  className="input"
                  type="username"
                  name="username"
                  value={formValues.username}
                  onChange={handleChange}
                  placeholder="username"
                  required
                  autoComplete="off"
                ></Form.Control>
                <Form.Text className="text-danger">
                  {formErrors.username}
                </Form.Text>
                <br />
                <Form.Label>Email :</Form.Label>
                <Form.Control
                  className="input"
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="example@chat.com"
                  required
                  autoComplete="off"
                ></Form.Control>
                <Form.Text className="text-danger">
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
                <Form.Text className="text-danger">
                  {formErrors.password}
                </Form.Text>
                <br />
                <Button type="submit" variant="primary">
                  Register
                </Button>
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
                Already have an account? <Link to="/login">Login</Link>
              </Form.Text>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Register;
