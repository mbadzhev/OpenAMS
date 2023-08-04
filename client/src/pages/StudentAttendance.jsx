import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import EventList from "../components/EventList";
import { Pie } from "react-chartjs-2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

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
  const [selectedModuleCode, setSelectedModuleCode] = useState(null);

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

  function handleModuleSelect(moduleId, moduleCode) {
    setSelectedModule(moduleId);
    setSelectedModuleCode(moduleCode);
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
    <Container className="my-3 bg-component py-3 rounded">
      <Row>
        <h1 className="pb-3 text-center">Student Attendance</h1>
        <Col>
          <Button variant="primary" onClick={() => handleModuleSelect(null)}>
            All Modules
          </Button>
          {studentData &&
            studentData.modules.map((module) => (
              <Button
                className="mx-2"
                variant="primary"
                key={module._id}
                onClick={() => handleModuleSelect(module._id, module.code)}
              >
                {module.code}
              </Button>
            ))}
        </Col>
      </Row>
      <Row>
        <Col md={7} xs={12}>
          <h2 className="my-3 text-center">Event List: {selectedModuleCode}</h2>
          <div
            style={{
              maxHeight: "600px",
              overflowY: "auto",
            }}
          >
            {studentData && (
              <EventList
                userData={studentData}
                selectedModule={selectedModule}
              />
            )}
          </div>
        </Col>
        <Col md={5} xs={12}>
          <h2 className="my-3 text-center">
            Module Attendance: {selectedModuleCode}
          </h2>
          {studentChartData && <Pie data={studentChartData} />}
        </Col>
      </Row>
    </Container>
  );
}

export default StudentAttendance;
