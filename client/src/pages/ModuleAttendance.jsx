import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import EventListItem from "../components/EventListItem";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

// Functions
import fetchModule from "../functions/fetchModule";
import getModuleAttendanceData from "../functions/getModuleAttendanceData";

function ModuleAttendance() {
  const { moduleId } = useParams();
  const [moduleData, setModuleData] = useState(null);
  const [moduleChartData, setModuleChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (moduleId) {
      getModuleData(moduleId);
    }
  }, [moduleId]);

  useEffect(() => {
    if (moduleData) {
      getAttendanceStatistics(moduleData);
    }
  }, [moduleData]);

  async function getModuleData(moduleId) {
    try {
      setLoading(true);
      const data = await fetchModule(moduleId);
      setModuleData(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setModuleData(null);
    } finally {
      setLoading(false);
    }
  }

  async function getAttendanceStatistics(moduleData) {
    try {
      const stats = await getModuleAttendanceData(moduleData);
      setModuleChartData(stats);
      setError(null);
    } catch (error) {
      setError(error.message);
      setModuleChartData(null);
    } finally {
      setLoading(false);
    }
  }

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <>
      <Container className="my-md-3 py-3 bg-component rounded">
        <Row>
          <Col>
            {loading && <h1 className="text-center">Loading...</h1>}
            {error && <h1 className="text-center">Error: {error}</h1>}
            {moduleData && (
              <h1 className="text-center">Module Data: {moduleData.code}</h1>
            )}
          </Col>
        </Row>
        <Row className="mb-5">
          <Col md={6} xs={12}>
            <h2 className="py-3 text-center">Event List</h2>
            <div
              style={{
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {moduleData &&
                moduleData.events.map((event) => (
                  <EventListItem
                    key={event._id}
                    event={event}
                    module={moduleData}
                    showModule={false}
                  />
                ))}
            </div>
          </Col>
          <Col md={6} xs={12}>
            <h2 className="py-3 text-center">Overall Attendance Rates</h2>
            {moduleChartData && (
              <Bar
                options={barChartOptions}
                data={moduleChartData.barChartData}
              />
            )}
          </Col>
        </Row>
        <Row className="pb-4">
          <Col>
            <h2 className="py-3 text-center">Event Attendance Rates</h2>
            {moduleChartData && (
              <Line
                options={lineChartOptions}
                data={moduleChartData.lineChartData}
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ModuleAttendance;
