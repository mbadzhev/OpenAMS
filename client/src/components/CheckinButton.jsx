import { useState } from "react";

// Components
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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

  const handleClosePopup = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {!isOpen && <Button onClick={togglePopup}>Check In</Button>}
      {isOpen && (
        <div className="popup">
          <div className="popup-content">
            <form onSubmit={handleSubmit}>
              <Row className="align-items-center">
                <Col xs="auto">
                  <Form.Control
                    type="text"
                    placeholder="Enter check-in code"
                    value={checkinCode}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col>
                  <Button className="me-2" type="submit">
                    Submit
                  </Button>
                  <Button variant="secondary" onClick={handleClosePopup}>
                    Hide
                  </Button>
                </Col>
              </Row>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckinButton;
