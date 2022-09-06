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

  // set the user values in formValues

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // set user data in backend

  const postUserData = async (user) => {
    const db = getDatabase();
    set(ref(db, "Users/Signup/" + user), {
      username: formValues.username,
      email: formValues.email,
      password: formValues.password,
      uid: user,
    });
  };

  //

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, formValues.email, formValues.password)
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
            password: "Password should be at least 6 characters",
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
          className=" text-black text-decoration-none"
          style={{ margin: "10px" }}
        >
          <img src="logo192.png" alt="logo" className="nav-logo" />
        </Link>
        <div className="nav-text">
          <Link to="/Login" className="nav-login" style={{ margin: "20px" }}>
            Login
          </Link>
          <Link to="/Register" className="nav-register">
            Register
          </Link>
        </div>
      </Navbar>
      <div className="register-card">
        <Card
          className="container"
          style={{ positon: "center", boxShadow: "2px 2px 15px" }}
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
                <Form.Text style={{ color: "red" }}>
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
                Already have an account? <Link to="/Login">Login</Link>
              </Form.Text>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Register;
