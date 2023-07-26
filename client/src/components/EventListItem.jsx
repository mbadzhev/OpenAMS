// Functions
import formatDate from "../functions/formatDate";

function EventListItem({ event, module }) {
  return (
    <li key={event._id}>
      {module && (
        <>
          <p>
            {module.name} ({module.code})
          </p>
        </>
      )}
      <p>Date: {formatDate(event.date)}</p>
      <p>Location: {event.location}</p>
      <p>Event Type: {event.eventType}</p>
      <p>Attendance Type: {event.attendanceType}</p>
    </li>
  );
}

export default EventListItem;
