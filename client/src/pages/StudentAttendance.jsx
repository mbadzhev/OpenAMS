import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import EventList from "../components/EventList";
import { Doughnut } from "react-chartjs-2";

// Functions
import fetchUserById from "../functions/fetchUserById";
import aggregateAttendanceData from "../functions/aggregateAttendanceData";

function StudentAttendance() {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [studentChartData, setStudentChartData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    if (studentId) {
      getStudentData(studentId);
    }
  }, [studentId]);

  useEffect(() => {
    if (studentData) {
      getAttendanceStatistics(studentData, selectedModule);
    }
  }, [studentData, selectedModule]);

  async function getStudentData(studentId) {
    try {
      setLoading(true);
      const data = await fetchUserById(studentId);
      setStudentData(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  }

  async function getAttendanceStatistics(userData, selectedModule) {
    try {
      const stats = await aggregateAttendanceData(userData, selectedModule);
      setStudentChartData(stats);
      setError(null);
    } catch (error) {
      setError(error.message);
      setStudentChartData(null);
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
        {studentData &&
          studentData.modules.map((module) => (
            <button
              key={module._id}
              onClick={() => handleModuleSelect(module._id)}
            >
              {module.code}
            </button>
          ))}
      </div>

      {studentData && (
        <EventList userData={studentData} selectedModule={selectedModule} />
      )}
      {studentChartData && <Doughnut data={studentChartData} />}
    </>
  );
}

export default StudentAttendance;
