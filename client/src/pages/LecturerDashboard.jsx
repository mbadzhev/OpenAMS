import { useState, useContext } from "react";

// Components
import EventsToday from "../components/EventsToday";

// Contexts
import UserContext from "../contexts/UserContext";

function LecturerDashboard() {
  const userData = useContext(UserContext);

  if (!userData) {
    return <h2>Loading data...</h2>;
  }

  return <>{userData && <EventsToday />}</>;
}

export default LecturerDashboard;
