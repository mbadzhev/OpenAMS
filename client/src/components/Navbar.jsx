import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

// Components
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavbarBS from "react-bootstrap/Navbar";

// Contexts
import UserContext from "../contexts/UserContext";

function Navbar() {
  const userData = useContext(UserContext);
  const auth = getAuth();

  // Logging out
  function handleLogOut() {
    signOut(auth)
      .then(() => {
        // Remove the "loggedIn" flag from sessionStorage
        sessionStorage.removeItem("loggedIn");
        console.log("User signed out successfully.");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  }

  return (
    <>
      <NavbarBS expand="lg" className="bg-body-tertiary">
        <Container>
          <NavbarBS.Brand>OpenAMS</NavbarBS.Brand>
          <NavbarBS.Toggle aria-controls="basic-navbar-nav" />
          <NavbarBS.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink to="/" className="nav-link">
                Dashboard
              </NavLink>
              {userData && userData.role === "student" && (
                <li>
                  <NavLink to={`/student/${userData._id}`} className="nav-link">
                    Attendance
                  </NavLink>
                </li>
              )}
              {userData && userData.role === "lecturer" && (
                <>
                  <NavLink to="/module" className="nav-link">
                    Module
                  </NavLink>
                  <NavLink to="/event" className="nav-link">
                    Event
                  </NavLink>
                  <NavLink to="/student" className="nav-link">
                    Student
                  </NavLink>
                </>
              )}
            </Nav>
            <Nav>
              {userData && (
                <NavLink
                  onClick={handleLogOut}
                  to="/logout"
                  className="nav-link"
                >
                  Log out
                </NavLink>
              )}
            </Nav>
          </NavbarBS.Collapse>
        </Container>
      </NavbarBS>
    </>
  );
}

export default Navbar;
