import Wrapper from "../assets/wrappers/Navbar";
import { FaAlignCenter, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import Logo from "./Logo";
import { useState } from "react";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { toggleSidebar, logoutUser, user } = useAppContext();
  return (
    <Wrapper>
      <div className="nav-center">
        <button className="toggle-btn" type="button" onClick={toggleSidebar}>
          <FaAlignCenter />
        </button>
        <div>
          <Logo />
          <h3 className="logo-text">dashboard </h3>
        </div>
        <div className="btn-container">
          <button
            className="btn"
            type="button"
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle />
            {user && user.name}
            <FaCaretDown />
          </button>
          <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
            <button className="dropdown-btn" type="button" onClick={logoutUser}>
              Log out
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
