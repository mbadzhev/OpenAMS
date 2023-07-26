import { useState, useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext";

// Components
import EventListItem from "../components/EventListItem";

function EventList() {
  const userData = useContext(UserContext);
  const [selectedModule, setSelectedModule] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    if (userData && userData.modules && userData.modules.length > 0) {
      setSelectedModule("All");
    }
  }, [userData]);

  useEffect(() => {
    if (selectedModule && userData && userData.events) {
      const filteredEvents = userData.events.filter(
        (event) =>
          selectedModule === "All" || event.module === selectedModule._id
      );
      setFilteredEvents(filteredEvents);
    }
  }, [selectedModule, userData]);

  function handleModuleClick(module) {
    setSelectedModule(module);
  }

  function handleSelectAllModules() {
    setSelectedModule("All");
  }

  return (
    <>
      {userData && userData.modules && userData.modules.length > 0 && (
        <div>
          <button onClick={handleSelectAllModules}>All Modules</button>
          {userData.modules.map((module) => (
            <button key={module._id} onClick={() => handleModuleClick(module)}>
              {module.name}
            </button>
          ))}
        </div>
      )}
      {filteredEvents.length === 0 && (
        <p>No events available for the selected module.</p>
      )}
      {filteredEvents.length > 0 && (
        <div>
          <h2>
            Selected Module:{" "}
            {selectedModule === "All" ? "All Modules" : selectedModule.name}
          </h2>
          <ul>
            {filteredEvents.map((event) => {
              // Find the corresponding module for the event
              const module = userData.modules.find(
                (module) => module._id === event.module
              );

              return (
                <EventListItem key={event._id} event={event} module={module} />
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

export default EventList;
