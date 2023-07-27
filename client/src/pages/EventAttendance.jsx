import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import AttendanceListItem from "../components/AttendanceListItem";

// Functions
import fetchEvent from "../functions/fetchEvent";
import patchEventLecturerCheckin from "../functions/patchEventLecturerCheckin";

function EventAttendance() {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortingOption, setSortingOption] = useState("all");

  useEffect(() => {
    if (eventId) {
      getEventData(eventId);
    }
  }, [eventId]);

  async function getEventData(eventId) {
    try {
      setLoading(true);
      const data = await fetchEvent(eventId);
      setEventData(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setEventData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchInputChange(event) {
    setSearchQuery(event.target.value);
  }

  function handleSortingOptionChange(option) {
    setSortingOption(option);
  }

  const filteredAttendance = eventData
    ? eventData.attendance.filter((attendanceItem) => {
        const { student } = attendanceItem;
        const fullName = `${student.firstName} ${student.lastName}`;
        return (
          fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.number.toString().includes(searchQuery)
        );
      })
    : [];

  const getSortedAttendance = () => {
    switch (sortingOption) {
      case "present":
        return filteredAttendance.filter((item) => item.present);
      case "absent":
        return filteredAttendance.filter((item) => !item.present);
      default:
        return filteredAttendance;
    }
  };

  // Helper function to generate the filter text
  const generateFilterText = () => {
    let filterText = "Student List for ";
    if (sortingOption === "present") {
      filterText += "Present Students";
    } else if (sortingOption === "absent") {
      filterText += "Absent Students";
    } else {
      filterText += "All Students";
    }
    if (searchQuery) {
      filterText += ` - Search: "${searchQuery}"`;
    }
    return filterText;
  };

  // Function to swap attendance status for all shown students
  const handleSwapAttendanceStatus = () => {
    getSortedAttendance().forEach((item) => {
      console.log(eventId, item.student._id, item.present);
      patchEventLecturerCheckin(eventId, item.student._id, item.present);
    });
  };

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
        <input
          type="text"
          placeholder="Search by name or number"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button onClick={() => handleSortingOptionChange("all")}>
          Show All
        </button>
        <button onClick={() => handleSortingOptionChange("present")}>
          Show Present
        </button>
        <button onClick={() => handleSortingOptionChange("absent")}>
          Show Absent
        </button>
        <button onClick={handleSwapAttendanceStatus}>Swap Attendance</button>
      </div>
      <div>
        <h2>{generateFilterText()}</h2>
        <ul>
          {getSortedAttendance().map((attendanceItem) => (
            <li key={attendanceItem._id}>
              <AttendanceListItem
                eventId={eventId}
                student={attendanceItem.student}
                status={attendanceItem.present}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default EventAttendance;
