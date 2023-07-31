import { useContext } from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

// Contexts
import UserContext from "../contexts/UserContext";

function Navbar() {
  const userData = useContext(UserContext);
  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully.");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        {userData && userData.role === "student" && (
          <li>
            <Link to={`/student/${userData._id}`}>Attendance</Link>
          </li>
        )}
        {userData && userData.role === "lecturer" && (
          <>
            <li>
              <Link to="/module">Modules</Link>
            </li>
            <li>
              <Link to="/event">Events</Link>
            </li>
            <li>
              <Link to="/student">Students</Link>
            </li>
          </>
        )}
        {userData && (
          <li>
            <button onClick={handleSignOut}>Sign Out</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
