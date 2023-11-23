import Main from "../assets/images/main.svg"
import Wrapper from "../assets/wrappers/LandingPage"
import { Logo } from "../componenets"
import { Link, Navigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import React from "react"

const Landing = () => {
  const { user } = useAppContext()
  return (
    <React.Fragment>
      {user && <Navigate to="/" />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          <div className="info">
            <h1>
              Job <span> Tracing</span> App
            </h1>
            <p>
              This is a job finding / posting web app made for learning
              purposes. Technology used in building this web app is MERN stack{" "}
            </p>
            <Link to="/register" className="btn btn-hero">
              Login / Register
            </Link>
          </div>
          <img
            src={Main}
            alt="Job Hunt Walking "
            className="img main-img"
          ></img>
        </div>
      </Wrapper>
    </React.Fragment>
  )
}

export default Landing
