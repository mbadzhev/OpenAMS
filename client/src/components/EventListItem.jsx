import { useNavigate } from "react-router-dom";

// Functions
import formatDate from "../functions/formatDate";

function EventListItem({ event, module }) {
  const navigate = useNavigate();

  function handleEventClick() {
    navigate(`/event/${event._id}`);
  }

  return (
    <li key={event._id}>
      {module && (
        <p>
          {module.name} ({module.code})
        </p>
      )}
      <p>Date: {formatDate(event.date)}</p>
      <p>Location: {event.location}</p>
      <p>Event Type: {event.eventType}</p>
      <p>Attendance Type: {event.attendanceType}</p>
      <button onClick={handleEventClick}>View Details</button>
    </li>
  );
}

export default EventListItem;
