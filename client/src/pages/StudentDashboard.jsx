import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Components
import EventsToday from "../components/EventsToday";
import { Doughnut } from "react-chartjs-2";

// Functions
import aggregateAttendanceData from "../functions/aggregateAttendanceData";
import fetchUser from "../functions/fetchUser";

ChartJS.register(ArcElement, Tooltip, Legend);

function StudentDashboard() {
  const [userData, setUserData] = useState(null);
  const [userChartData, setUserChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // temp
  const userId = "649afa6a58545270f6928cb7";

  useEffect(() => {
    fetchData(userId);
  }, []);
  useEffect(() => {
    if (userData) {
      getAttendanceStatistics(userData);
    }
  }, [userData]);

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
  async function getAttendanceStatistics(userData) {
    try {
      const stats = await aggregateAttendanceData(userData);
      setUserChartData(stats);
      setError(null);
    } catch (error) {
      setError(error.message);
      setUserChartData(null);
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
      {userData && <EventsToday userObj={userData} userId={userId} />}
      {userChartData && <Doughnut data={userChartData} />}
    </>
  );
}

export default StudentDashboard;
