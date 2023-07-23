import { useState, useEffect, useContext } from "react";

// Components
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
  const [selectedModule, setSelectedModule] = useState(null);

  if (!userData) {
    return <h2>Loading data...</h2>;
  }

  useEffect(() => {
    if (userData) {
      getAttendanceStatistics(userData, selectedModule);
    }
  }, [userData, selectedModule]);

  async function getAttendanceStatistics(userData, selectedModule) {
    try {
      const stats = await aggregateAttendanceData(userData, selectedModule);
      setUserChartData(stats);
      setError(null);
    } catch (error) {
      setError(error.message);
      setUserChartData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleModuleSelect(moduleId) {
    setSelectedModule(moduleId);
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
      <div>
        <button onClick={() => handleModuleSelect(null)}>
          Show All Modules
        </button>
        {userData &&
          userData.modules.map((module) => (
            <button
              key={module._id}
              onClick={() => handleModuleSelect(module._id)}
            >
              {module.name}
            </button>
          ))}
      </div>
      <EventList user={userData._id} selectedModule={selectedModule} />
      {userChartData && <Doughnut data={userChartData} />}
    </>
  );
}

export default StudentAttendance;
