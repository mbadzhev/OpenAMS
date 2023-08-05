import { useState } from "react";

// Components
import ShowTokensButton from "./ShowTokensButton";
import GenerateTokenButton from "./GenerateTokenButton";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function LecturerEventList({ todayEvents, modules }) {
  const [refetch, setRefetch] = useState(false);

  // Function to handle refetch state change
  function handleRefetchChange() {
    setRefetch((prevRefetch) => !prevRefetch);
  }

  const listItems = todayEvents.map((event) => {
    let moduleName, moduleCode;
    modules.some((module) => {
      if (module._id === event.module) {
        moduleName = module.name;
        moduleCode = module.code;
      }
    });

    const eventTime = new Date(event.date).getTime();
    const twoHoursBeforeNow = Date.now() - 2 * 60 * 60 * 1000;
    const isEventInPast = eventTime < twoHoursBeforeNow;

    return (
      <Row className="mb-4" key={event._id}>
        <Col md={8} xs={12}>
          <h3>
            {moduleName} ({moduleCode})
          </h3>
          <h5>
            Event: {event.eventType} | Attendance: {event.attendanceType}
            {event.eventType !== "online" && ` | Location: ${event.location}`} |
            Time:{" "}
            {new Date(event.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h5>
        </Col>
        <Col md={4} xs={12} className="text-end">
          {isEventInPast ? (
            <>
              <h5>Token generation unavailable.</h5>
              <ShowTokensButton eventId={event._id} refetch={refetch} />
            </>
          ) : (
            <>
              <ShowTokensButton eventId={event._id} refetch={refetch} />
              <GenerateTokenButton
                eventId={event._id}
                onRefetchChange={handleRefetchChange}
              />
            </>
          )}
        </Col>
      </Row>
    );
  });

  return <>{listItems}</>;
}

export default LecturerEventList;
