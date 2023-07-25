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
    <div>
      <h2>Event List</h2>
      <ul>
        {formattedEventData.map((event) => (
          <li key={event.eventId}>
            <p>Date: {event.date}</p>
            <p>Module Name: {event.moduleName}</p>
            <p>Module Code: {event.moduleCode}</p>
            <p>Event Type: {event.eventType}</p>
            <p>Attendance Type: {event.attendanceType}</p>
            <p>
              Student Attendance:{" "}
              {event.studentAttendance.length > 0
                ? event.studentAttendance[0].present
                  ? "Present"
                  : "Absent"
                : "Not available"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventList;
