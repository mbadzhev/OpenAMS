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
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {moduleData && (
        <ul>
          {moduleData.events.map((event) => (
            <EventListItem key={event._id} event={event} module={moduleData} />
          ))}
        </ul>
      )}
      {moduleChartData && (
        <>
          <Bar options={barChartOptions} data={moduleChartData.barChartData} />
          <Line
            options={lineChartOptions}
            data={moduleChartData.lineChartData}
          />
        </>
      )}
      ;
    </>
  );
}

export default ModuleAttendance;
