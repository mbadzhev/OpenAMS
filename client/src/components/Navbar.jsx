import { useContext } from "react";
import { Link } from "react-router-dom";

// Contexts
import UserContext from "../contexts/UserContext";

function Navbar() {
  const userData = useContext(UserContext);
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
      </ul>
    </nav>
  );
}

export default Navbar;
