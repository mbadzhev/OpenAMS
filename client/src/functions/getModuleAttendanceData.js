// Functions
import fetchEvent from "./fetchEvent";
import formatDate from "./formatDate";
import calculateAttendanceRate from "./calculateAttendanceRate";

async function getModuleAttendanceData(moduleData) {
  try {
    const mandatoryEventsData = [];
    const optionalEventsData = [];
    let totalMandatoryAttendance = 0;
    let totalOptionalAttendance = 0;
    let totalMandatoryStudents = 0;
    let totalOptionalStudents = 0;

    const today = new Date();

    for (const event of moduleData.events) {
      const eventData = await fetchEvent(event._id);
      const eventDate = new Date(eventData.date);

      // Ignore events that have occurred in the past
      if (eventDate > today) {
        continue;
      }

      const attendanceRate = await calculateAttendanceRate(eventData);
      const formattedDate = formatDate(eventData.date);

      const eventDataToStore = {
        eventId: eventData._id,
        eventDateTime: formattedDate,
        attendanceRate: attendanceRate,
      };

      if (eventData.attendanceType === "mandatory") {
        mandatoryEventsData.push(eventDataToStore);
        totalMandatoryAttendance += parseFloat(attendanceRate);
        totalMandatoryStudents++;
      } else if (eventData.attendanceType === "optional") {
        optionalEventsData.push(eventDataToStore);
        totalOptionalAttendance += parseFloat(attendanceRate);
        totalOptionalStudents++;
      } else {
        // Handle cases where eventData.attendanceType is neither "mandatory" nor "optional"
        console.warn(
          `Unknown attendanceType "${eventData.attendanceType}" for event: ${eventDataToStore.eventDateTime}`
        );
      }
    }

    // Calculate total attendance rate for mandatory and optional events
    const totalMandatoryAttendanceRate = totalMandatoryStudents
      ? totalMandatoryAttendance / totalMandatoryStudents
      : 0;
    const totalOptionalAttendanceRate = totalOptionalStudents
      ? totalOptionalAttendance / totalOptionalStudents
      : 0;

    // Format data for the charts
    const labels = [
      ...mandatoryEventsData.map((event) => event.eventDateTime),
      ...optionalEventsData.map((event) => event.eventDateTime),
    ];
    const data = [
      ...mandatoryEventsData.map((event) => parseFloat(event.attendanceRate)),
      ...optionalEventsData.map((event) => parseFloat(event.attendanceRate)),
    ];

    const barChartData = {
      labels: ["Mandatory Events", "Optional Events"],
      datasets: [
        {
          label: "Attendance Rate",
          data: [
            totalMandatoryAttendanceRate.toFixed(2),
            totalOptionalAttendanceRate.toFixed(2),
          ],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    };

    const lineChartData = {
      labels,
      datasets: [
        {
          label: "Attendance Rate",
          data,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    return { barChartData, lineChartData };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default getModuleAttendanceData;
