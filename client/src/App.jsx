import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Components
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import StudentList from "./pages/StudentList";
import StudentAttendance from "./pages/StudentAttendance";
import EventList from "./pages/EventList";
import EventAttendance from "./pages/EventAttendance";
import ModuleList from "./pages/ModuleList";
import ModuleAttendance from "./pages/ModuleAttendance";
import Login from "./pages/Login";

// Contexts
import UserContext from "./contexts/UserContext";

// Functions
import fetchUserById from "./functions/fetchUserById";
import fetchUserByEmail from "./functions/fetchUserByEmail";

function App() {
  const [user, setUser] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setUser(true);
        let userEmail;
        user.providerData.forEach((profile) => {
          userEmail = profile.email;
        });
        fetchData(userEmail);
        // Check if the user has just logged in (not already logged in)
        if (!sessionStorage.getItem("loggedIn")) {
          // Mark the user as logged in
          sessionStorage.setItem("loggedIn", "true");
          // Redirect the user to the dashboard after login
          navigate(`/`);
        }
      } else {
        setUser(false);
        navigate(`/login`);
      }
    });

    return unsubscribe;
  }, [auth, navigate]);

  async function fetchData(userEmail) {
    try {
      const user = await fetchUserByEmail(userEmail);
      const response = await fetchUserById(user._id);
      setUserData(response);
      setError(null);
    } catch (error) {
      setError(error.message);
      setUserData(null);
    }
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{`Error: ${error}`}</h1>;
  }

  return (
    <>
      <UserContext.Provider value={userData}>
        {user && userData && <Navbar />}
        <Routes>
          {userData && userData.role === "lecturer" && (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/module" element={<ModuleList />} />
              <Route path="/module/:moduleId" element={<ModuleAttendance />} />
              <Route path="/event" element={<EventList />} />
              <Route path="/event/:eventId" element={<EventAttendance />} />
              <Route path="/student" element={<StudentList />} />
              <Route
                path="/student/:studentId"
                element={<StudentAttendance />}
              />
            </>
          )}
          {userData && userData.role === "student" && (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/student/:studentId"
                element={<StudentAttendance />}
              />
            </>
          )}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
