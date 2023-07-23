// Aggregates data for events linked to a user and a selected module (if provided)
async function aggregateAttendanceData(userData, selectedModule = null) {
  let eventsTotal = 0,
    eventsPresent = 0,
    eventsAbsent = 0;

  try {
    userData.events.forEach((event) => {
      if (!selectedModule || event.module === selectedModule) {
        event.attendance.forEach((attendance) => {
          if (attendance.student === userData._id) {
            eventsTotal++;
            if (attendance.present) {
              eventsPresent++;
            } else {
              eventsAbsent++;
            }
          }
        });
      }
    });

    const chartData = {
      labels: ["Present Events", "Absent Events"],
      datasets: [
        {
          label: "Number of Events",
          data: [eventsPresent, eventsAbsent],
          backgroundColor: ["rgba(0, 255, 0, 0.5)", "rgba(255, 0, 0, 0.5)"],
          borderColor: ["rgba(0, 255, 0, 1)", "rgba(255, 0, 0, 1)"],
          borderWidth: 1,
        },
      ],
    };

    return chartData;
  } catch (error) {
    console.error(error);
  }
}

export default aggregateAttendanceData;
