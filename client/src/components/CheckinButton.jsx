import React, { useState } from "react";

// Functions
import patchEventStudentCheckin from "../functions/patchEventStudentCheckin";

function CheckinButton({ eventId, userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [checkinCode, setCheckinCode] = useState("");

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (event) => {
    setCheckinCode(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await patchEventStudentCheckin(eventId, userId, checkinCode);
    setIsOpen(false);
  };

  return (
    <div>
      {!isOpen && <button onClick={togglePopup}>Check In</button>}
      {isOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Enter code</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={checkinCode}
                onChange={handleInputChange}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckinButton;
