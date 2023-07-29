import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/StudentDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import StudentList from "./pages/StudentList";
import StudentAttendance from "./pages/StudentAttendance";
import EventList from "./pages/EventList";
import EventAttendance from "./pages/EventAttendance";
import ModuleList from "./pages/ModuleList";
import ModuleAttendance from "./pages/ModuleAttendance";

// Contexts
import UserContext from "./contexts/UserContext";

// Functions
import fetchUser from "./functions/fetchUser";

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // temps
  const userId = "649abe098f09a4b95794d6af";
  // const userId = "649afa6a58545270f6928cb7";

  useEffect(() => {
    fetchData(userId);
  }, []);

  async function fetchData(userId) {
    try {
      const response = await fetchUser(userId);
      setUserData(response);
      setError(null);
    } catch (error) {
      setError(error.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return (
      <h1>{`There is a problem fetching the requested data - ${error}`}</h1>
    );
  }

  return (
    <>
      <UserContext.Provider value={userData}>
        <Navbar />
        <Routes>
          {userData && userData.role === "lecturer" && (
            <>
              <Route path="/" element={<LecturerDashboard />} />
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
              <Route path="/" element={<StudentDashboard />} />
              <Route
                path="/student/:studentId"
                element={<StudentAttendance />}
              />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
