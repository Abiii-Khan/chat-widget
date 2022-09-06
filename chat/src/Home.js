import { Link } from "react-router-dom";
import {React} from "react";
import { Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
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
          <Link
            to="/Login"
            className="nav-login"
            style={{ margin: "20px" }}
          >
            Login
          </Link>
          <Link
            to="/Register"
            className="nav-register"
          >
            Register
          </Link>
        </div>
      </Navbar>
      <img src="logo512.png" alt="logo" className="home-img"/>
      <h1 className="home-h1">CHAT</h1>
    </>
  );
};
export default Home;
