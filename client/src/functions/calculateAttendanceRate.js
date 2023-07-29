async function calculateAttendanceRate(eventData) {
  try {
    if (!eventData.attendance || eventData.attendance.length === 0) {
      return 0; // To handle the case where there are no attendance records for the event.
    }

    const totalStudents = eventData.attendance.length;
    const presentStudents = eventData.attendance.filter(
      (entry) => entry.present
    ).length;

    if (totalStudents === 0) {
      return 0; // To handle the case where there are no students registered for the event.
    }

    const attendanceRate = (presentStudents / totalStudents) * 100;
    return attendanceRate.toFixed(2);
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export default calculateAttendanceRate;
