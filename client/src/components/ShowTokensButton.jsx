import { useState, useEffect } from "react";

// Functions
import fetchEvent from "../functions/fetchEvent";

function ShowTokensButton({ eventId }) {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchData(eventId);
  }, [eventId]);

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
      return <button onClick={togglePopup}>Show Tokens</button>;
    } else {
      return (
        <>
          {eventData.tokens.map((token) => {
            const code = token.code;
            const expire = token.expiredAt;
            return (
              <div key={token._id}>
                <h4>Code: {code}</h4>
                <h5>Expiration: {expire}</h5>
              </div>
            );
          })}
          <button onClick={togglePopup}>Hide Tokens</button>
        </>
      );
    }
  }
}
export default ShowTokensButton;
