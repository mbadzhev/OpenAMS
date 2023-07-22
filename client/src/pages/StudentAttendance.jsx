import { useState, useEffect, useContext } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Components
import EventsToday from "../components/EventsToday";
import EventList from "../components/EventList";
import { Doughnut } from "react-chartjs-2";

// Contexts
import UserContext from "../contexts/UserContext";

// Functions
import aggregateAttendanceData from "../functions/aggregateAttendanceData";

function StudentAttendance() {
  const userData = useContext(UserContext);
  const [userChartData, setUserChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!userData) {
    return <h2>Loading data...</h2>;
  }

  useEffect(() => {
    if (userData) {
      getAttendanceStatistics(userData);
    }
  }, [userData]);

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
    return <h2>Loading...</h2>;
  }
  if (error) {
    return (
      <h2>{`There is a problem fetching the requested data - ${error}`}</h2>
    );
  }

  return (
    <>
      {userData && <EventList user={userData._id} />}
      {userChartData && <Doughnut data={userChartData} />}
    </>
  );
}
export default StudentAttendance;
