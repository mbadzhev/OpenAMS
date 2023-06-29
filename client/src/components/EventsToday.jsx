import React, { useState, useEffect } from "react";
import fetchUser from "../functions/fetchUser";

const EventsToday = ({ userId }) => {
  const [getData, setData] = useState(null);
  const [getLoading, setGetLoading] = useState(true);
  const [getError, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await fetchUser(userId);
        setData(responseData);
        setError(null);
      } catch (error) {
        setError(error.message);
        setData(null);
      } finally {
        setGetLoading(false);
      }
    };

    fetchData();
  }, []);

  if (getLoading) {
    return <h1>Loading...</h1>;
  }

  if (getError) {
    return (
      <h1>{`There is a problem fetching the requested data - ${getError}`}</h1>
    );
  }

  const todayEvents = getData.events.filter((obj) => {
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
  }

  function EventList() {
    const listItems = todayEvents.map((event) => {
      let moduleName, moduleCode, status;
      getData.modules.some((module) => {
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
        </li>
      );
    });

    return <ul>{listItems}</ul>;
  }

  return (
    <>
      <h2>Events Today</h2>
      <EventList />
    </>
  );
};

export default EventsToday;
