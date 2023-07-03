import { useState, useEffect } from "react";

// Components
import StudentDashboard from "./pages/StudentDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";

// Contexts
import UserContext from "./contexts/UserContext";

// Functions
import fetchUser from "./functions/fetchUser";

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // temps
  // const userId = "649abe098f09a4b95794d6af";
  const userId = "649afa6a58545270f6928cb7";

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

  if (userData && userData.role === "lecturer") {
    return (
      <UserContext.Provider value={userData}>
        <LecturerDashboard />
      </UserContext.Provider>
    );
  } else if (userData && userData.role === "student") {
    return (
      <UserContext.Provider value={userData}>
        <StudentDashboard />
      </UserContext.Provider>
    );
  } else {
    return <div>Render Alternative Component</div>;
  }
}

export default App;
