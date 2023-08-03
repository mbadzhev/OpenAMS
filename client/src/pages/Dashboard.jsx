import { useState, useEffect, useContext } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Components
import LecturerEventList from "../components/LecturerEventList";
import StudentEventList from "../components/StudentEventList";
import { Pie } from "react-chartjs-2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Contexts
import UserContext from "../contexts/UserContext";

// Functions
import aggregateAttendanceData from "../functions/aggregateAttendanceData";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const userData = useContext(UserContext);
  const [userChartData, setUserChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!userData) {
    return <h1>Loading data...</h1>;
  }

  useEffect(() => {
    if (userData && userData.role === "student") {
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

  const todayEvents = userData.events.filter((obj) => {
    const eventDate = new Date(obj.date);
    eventDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (eventDate.getTime() === currentDate.getTime()) {
      return true;
    } else {
      return false;
    }
  });

  if (todayEvents.length === 0) {
    return (
      <Container className="my-3 bg-component rounded">
        <Row>
          <Col>
            <h1 className="py-3 text-center">No events today.</h1>
          </Col>
        </Row>
      </Container>
    );
  } else if (userData && userData.role === "lecturer") {
    return (
      <Container className="my-3 bg-component rounded">
        <Row>
          <Col>
            <h1 className="py-3 text-center">Events Today</h1>
            <LecturerEventList
              todayEvents={todayEvents}
              modules={userData.modules}
            />
          </Col>
        </Row>
      </Container>
    );
  } else if (userData && userData.role === "student") {
    return (
      <Container className="my-3 bg-component rounded">
        <Row>
          <h1 className="py-3 text-center">Events Today</h1>
          <Col>
            <StudentEventList
              todayEvents={todayEvents}
              modules={userData.modules}
              userId={userData._id}
            />
          </Col>
          <Col>{userChartData && <Pie data={userChartData} />}</Col>
        </Row>
      </Container>
    );
  } else {
    return (
      <Container className="my-3 text-center">
        <Row>
          <h1>Something went wrong.</h1>
        </Row>
      </Container>
    );
  }
}

export default Dashboard;
