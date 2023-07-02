import React, { useState, useEffect } from "react";

// Components
import LecturerEventList from "./LecturerEventList";
import StudentEventList from "./StudentEventList";

const EventsToday = ({ userObj, userId }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setUserData(userObj);
  }, [userObj]);

  if (!userData) {
    return <h2>Loading data...</h2>;
  }

  const todayEvents = userData.events.filter((obj) => {
    const eventDate = new Date(obj.date);
    eventDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (eventDate.getTime() === currentDate.getTime()) {
      return true;
    } else {
      return false;
    }
  });

  if (todayEvents.length === 0) {
    return (
      <>
        <h1>Events Today</h1>
        No events today.
      </>
    );
  } else if (userData && userData.role === "lecturer") {
    return (
      <LecturerEventList todayEvents={todayEvents} modules={userData.modules} />
    );
  } else if (userData && userData.role === "student") {
    return (
      <StudentEventList
        todayEvents={todayEvents}
        modules={userData.modules}
        userId={userId}
      />
    );
  } else {
    return <div>Render Alternative Component</div>;
  }
};

export default EventsToday;
