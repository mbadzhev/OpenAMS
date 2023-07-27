// Functions
import patchEventLecturerCheckin from "../functions/patchEventLecturerCheckin";

function AttendanceListItem({ eventId, student, status }) {
  const swapAttendanceStatus = () => {
    patchEventLecturerCheckin(eventId, student._id, status);
  };

  return (
    <>
      <h3>
        {student.firstName} {student.lastName} ({student.number})
      </h3>
      <h3>{status ? "Present" : "Absent"}</h3>
      <button onClick={swapAttendanceStatus}>
        Mark {status ? "Absent" : "Present"}
      </button>
    </>
  );
}

export default AttendanceListItem;
