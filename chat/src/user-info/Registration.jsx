/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Button, Form, Card, Navbar } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDatabase, ref, set } from "firebase/database";
import FormInput from "./FormInput.jsx";

const Register = () => {
  const initialValues = { username: "", email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  // set the user filled data values in formValues

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // set/post user data in backend

  const postUserData = async (user) => {
    const db = getDatabase();
    set(ref(db, "users/signup/" + user), {
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
        toast.success("Account created successfully!");
        if (userCredential?.user?.uid) {
          postUserData(userCredential.user.uid);
        }
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
            password: "Password should atleast 6 digits",
          });
        }
      });
  };

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
                <FormInput
                  label={"Username :"}
                  inputProps={{
                    className:"input",
                    type:"username",
                    name:"username",
                    value:formValues.username,
                    onChange:handleChange,
                    placeholder:"username",
                    required: true,
                    autoComplete:"off"
                  }}
                  error={formErrors.username}
                  errorText={{
                    className: "text-danger"
                  }}
                />
                <br />
                <FormInput
                  label={"Email :"}
                  inputProps={{
                    className:"input",
                    type:"email",
                    name:"email",
                    value:formValues.email,
                    onChange:handleChange,
                    placeholder:"email",
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
                    placeholder:"password",
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
