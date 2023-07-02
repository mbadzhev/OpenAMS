import { useState, useEffect } from "react";

// Components
import EventsToday from "../components/EventsToday";

// Functions
import fetchUser from "../functions/fetchUser";

function LecturerDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // temp
  const userId = "649abe098f09a4b95794d6af";

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

  return <>{userData && <EventsToday userObj={userData} userId={userId} />}</>;
}

export default LecturerDashboard;
