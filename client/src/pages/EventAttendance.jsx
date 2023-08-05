import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import AttendanceListItem from "../components/AttendanceListItem";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

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
    let filterText = "Student List: ";
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
    <Container className="my-md-3 bg-component py-3 rounded">
      <Row className="mb-3">
        <h1 className="pb-3 text-center">{generateFilterText()}</h1>
        <Col lg={6} xs={12}>
          <Form.Control
            className="m-1"
            type="text"
            placeholder="Search by student name or number"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </Col>
        <Col lg={6} xs={12}>
          <Button
            className="m-1"
            variant="primary"
            onClick={() => handleSortingOptionChange("all")}
          >
            Show All
          </Button>
          <Button
            className="m-1"
            variant="primary"
            onClick={() => handleSortingOptionChange("present")}
          >
            Show Present
          </Button>
          <Button
            className="m-1"
            variant="primary"
            onClick={() => handleSortingOptionChange("absent")}
          >
            Show Absent
          </Button>
          <Button variant="warning" onClick={handleSwapAttendanceStatus}>
            Swap Attendance
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {getSortedAttendance().map((attendanceItem) => (
            <AttendanceListItem
              key={attendanceItem._id}
              eventId={eventId}
              student={attendanceItem.student}
              status={attendanceItem.present}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default EventAttendance;
