import { useState, useEffect } from "react";

// Components
import Button from "react-bootstrap/Button";

// Functions
import fetchEvent from "../functions/fetchEvent";
import formatDate from "../functions/formatDate";

function ShowTokensButton({ eventId, refetch }) {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchData(eventId);
  }, [eventId, refetch]);

  async function fetchData(eventId) {
    try {
      const response = await fetchEvent(eventId);
      setEventData(response);
      setError(null);
    } catch (error) {
      setError(error.message);
      setEventData(null);
    } finally {
      setLoading(false);
    }
  }

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return (
      <h1>{`There is a problem fetching the requested data - ${error}`}</h1>
    );
  }

  if (eventData) {
    if (!isOpen) {
      return (
        <Button className="me-2" onClick={togglePopup}>
          Show Tokens
        </Button>
      );
    } else {
      return (
        <>
          {eventData.tokens.map((token) => {
            const code = token.code;
            const expire = formatDate(token.expiredAt);
            return (
              <div key={token._id}>
                <h5>Code: {code}</h5>
                <h6>Expiration: {expire}</h6>
              </div>
            );
          })}
          <Button className="me-2" variant="secondary" onClick={togglePopup}>
            Hide Tokens
          </Button>
        </>
      );
    }
  }
}
export default ShowTokensButton;
