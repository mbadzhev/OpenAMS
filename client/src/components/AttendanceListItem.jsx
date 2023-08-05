// Components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// Functions
import patchEventLecturerCheckin from "../functions/patchEventLecturerCheckin";

function AttendanceListItem({ eventId, student, status }) {
  const swapAttendanceStatus = () => {
    patchEventLecturerCheckin(eventId, student._id, status);
  };

  return (
    <>
      <Row className="my-2">
        <Col md={6} xs={12}>
          <h4>
            {student.firstName} {student.lastName} ({student.number})
          </h4>
        </Col>
        <Col md={4} xs={12}>
          <Button disabled variant={status ? "success" : "danger"}>
            {status ? "Present" : "Absent"}
          </Button>
        </Col>
        <Col md={2} xs={12} className="text-end">
          <Button variant="warning" onClick={swapAttendanceStatus}>
            Mark {status ? "Absent" : "Present"}
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default AttendanceListItem;
