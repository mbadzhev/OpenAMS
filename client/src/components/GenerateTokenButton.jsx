import { useState } from "react";

// Components
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

// Functions
import createToken from "../functions/createToken";

function GenerateTokenButton({ eventId, onRefetchChange }) {
  const [tokenTime, setTokenTime] = useState(10);

  function handleTimeChange(time) {
    setTokenTime(time);
  }

  async function handleClick() {
    const tokenData = {
      event: eventId,
      expiredAt: Date.now() + tokenTime * 60 * 1000,
    };
    try {
      const newToken = await createToken(tokenData);
      console.log("New token created:", newToken);

      // Call the prop to trigger refetch event data in ShowTokenButton
      onRefetchChange();
    } catch (error) {
      console.error("Error creating token:", error);
    }
  }

  return (
    <>
      <ButtonGroup>
        <Button onClick={handleClick}>Generate Token:</Button>
        <DropdownButton
          as={ButtonGroup}
          title={`${tokenTime} minutes`}
          id="bg-nested-dropdown"
          onSelect={handleTimeChange}
        >
          <Dropdown.Item eventKey={5}>5 minutes</Dropdown.Item>
          <Dropdown.Item eventKey={10}>10 minutes</Dropdown.Item>
          <Dropdown.Item eventKey={15}>15 minutes</Dropdown.Item>
          <Dropdown.Item eventKey={30}>30 minutes</Dropdown.Item>
          <Dropdown.Item eventKey={60}>60 minutes</Dropdown.Item>
          <Dropdown.Item eventKey={120}>120 minutes</Dropdown.Item>
        </DropdownButton>
      </ButtonGroup>
    </>
  );
}
export default GenerateTokenButton;
