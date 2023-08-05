import CheckinButton from "./CheckinButton";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function StudentEventList({ todayEvents, modules, userId }) {
  const listItems = todayEvents.map((event) => {
    let moduleName, moduleCode, status;
    modules.some((module) => {
      if (module._id === event.module) {
        moduleName = module.name;
        moduleCode = module.code;
      }
    });
    event.attendance.map((attendance) => {
      status = attendance.present;
    });

    const eventTime = new Date(event.date).getTime();
    const twoHoursBeforeNow = Date.now() - 2 * 60 * 60 * 1000;
    const isEventInPast = eventTime < twoHoursBeforeNow;

    return (
      <Row className="mb-4" key={event._id}>
        <Col md={8} xs={12}>
          <h3>
            {moduleName} ({moduleCode})
          </h3>
          <h5>
            Event: {event.eventType} | Attendance: {event.attendanceType}
            {event.eventType !== "online" && ` | Location: ${event.location}`} |
            Time:{" "}
            {new Date(event.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h5>
        </Col>
        <Col md={4} xs={12}>
          {isEventInPast && !status ? (
            <h3>Absent</h3>
          ) : status ? (
            <h3>Present</h3>
          ) : (
            <CheckinButton eventId={event._id} userId={userId} />
          )}
        </Col>
      </Row>
    );
  });

  return <>{listItems}</>;
}

export default StudentEventList;
