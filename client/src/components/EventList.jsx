// Components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// Functions
import formatDate from "../functions/formatDate";

function EventList({ userData, selectedModule }) {
  function getModuleInfo(moduleId) {
    return userData.modules.find((module) => module._id === moduleId);
  }

  function getFormattedEventData() {
    if (!userData) return [];
    let filteredEvents = userData.events;

    if (selectedModule) {
      filteredEvents = filteredEvents.filter(
        (event) => event.module === selectedModule
      );
    }

    return filteredEvents.map((event) => {
      const { _id, date, attendance, module, eventType, attendanceType } =
        event;
      const moduleInfo = getModuleInfo(module);
      const moduleName = moduleInfo ? moduleInfo.name : "Unknown Module";
      const moduleCode = moduleInfo ? moduleInfo.code : "Unknown Code";
      const currentUserAttendance = attendance.find(
        (item) => item.student === userData._id
      );
      const studentAttendance = currentUserAttendance
        ? [
            {
              student: currentUserAttendance.student,
              present: currentUserAttendance.present,
            },
          ]
        : [];

      return {
        eventId: _id,
        date,
        moduleName,
        moduleCode,
        eventType,
        attendanceType,
        studentAttendance,
      };
    });
  }

  const formattedEventData = getFormattedEventData();

  return (
    <>
      {formattedEventData.map((event) => (
        <Row key={event.eventId}>
          <Col md={10} xs={12}>
            <h4>
              {event.moduleName} ({event.moduleCode})
            </h4>
            <h6>
              Event: {event.eventType} | Attendance: {event.attendanceType}
              {event.eventType !== "online" &&
                ` | Location: ${event.location}`}{" "}
              | Time: {formatDate(event.date)}
            </h6>
          </Col>
          <Col md={2} xs={12} className="md-text-end xs-text-start">
            <div>
              {event.studentAttendance.length > 0 ? (
                event.studentAttendance[0].present ? (
                  <Button variant="success" disabled>
                    Present
                  </Button>
                ) : (
                  <Button variant="danger" disabled>
                    Absent
                  </Button>
                )
              ) : (
                <Button variant="secondary" disabled>
                  Not available
                </Button>
              )}
            </div>
          </Col>
        </Row>
      ))}
    </>
  );
}

export default EventList;
