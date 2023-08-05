import { useState, useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext";

// Components
import EventListItem from "../components/EventListItem";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

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
    <Container className="my-md-3 py-3 bg-component rounded">
      <Row className="mb-2">
        {filteredEvents.length > 0 && (
          <>
            <h1 className="pb-3 text-center">
              Event List:{" "}
              {selectedModule === "All" ? "All Modules" : selectedModule.code}
            </h1>
          </>
        )}
        <Col>
          {userData && userData.modules && userData.modules.length > 0 && (
            <>
              <Button
                className="mx-2"
                variant="primary"
                onClick={handleSelectAllModules}
              >
                All Modules
              </Button>
              {userData.modules.map((module) => (
                <Button
                  className="mx-2"
                  variant="primary"
                  key={module._id}
                  onClick={() => handleModuleClick(module)}
                >
                  {module.code}
                </Button>
              ))}
            </>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {filteredEvents.length === 0 && (
            <h2>No events available for the selected module.</h2>
          )}
          {filteredEvents.length > 0 && (
            <>
              {filteredEvents.map((event) => {
                // Find the corresponding module for the event
                const module = userData.modules.find(
                  (module) => module._id === event.module
                );

                return (
                  <EventListItem
                    key={event._id}
                    event={event}
                    module={module}
                    showModule={true}
                  />
                );
              })}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default EventList;
