import { useNavigate } from "react-router-dom";

// Components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// Functions
import formatDate from "../functions/formatDate";

function EventListItem({ event, module, showModule }) {
  const navigate = useNavigate();

  function handleEventClick() {
    navigate(`/event/${event._id}`);
  }

  return (
    <Row className="mb-4" key={event._id}>
      <Col md={9} xs={12}>
        {showModule && (
          <h4>
            {module.name} ({module.code})
          </h4>
        )}
        <h6>
          Time: {formatDate(event.date)} | Attendance: {event.attendanceType}
          {event.eventType !== "online" && ` | Location: ${event.location}`} |
          Event: {event.eventType}
        </h6>
      </Col>
      <Col md={3} xs={12} className="d-md-flex justify-content-md-end">
        <Button onClick={handleEventClick}>View Details</Button>
      </Col>
    </Row>
  );
}

export default EventListItem;
