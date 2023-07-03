import AttendanceStatus from "./AttendanceStatus";
import CheckinButton from "./CheckinButton";

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

    return (
      <li key={event._id}>
        <h2>
          {moduleName} ({moduleCode})
        </h2>
        <h2>Event Type: {event.eventType}</h2>
        <h2>Attendance Type: {event.attendanceType}</h2>
        {event.eventType !== "online" && <h2>Location: {event.location}</h2>}
        <h2>
          Time:{" "}
          {new Date(event.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </h2>
        {status ? (
          <AttendanceStatus />
        ) : (
          <CheckinButton eventId={event._id} userId={userId} />
        )}
      </li>
    );
  });

  return <ul>{listItems}</ul>;
}

export default StudentEventList;
