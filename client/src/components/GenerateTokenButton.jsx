import { useState } from "react";

// Functions
import createToken from "../functions/createToken";

function GenerateTokenButton({ eventId }) {
  const [tokenTime, setTokenTime] = useState(10);

  const handleTimeChange = (event) => {
    setTokenTime(event.target.value);
  };

  const handleClick = async () => {
    const tokenData = {
      event: eventId,
      expiredAt: Date.now() + tokenTime * 60 * 1000,
    };
    try {
      const newToken = await createToken(tokenData);
      console.log("New token created:", newToken);
    } catch (error) {
      console.error("Error creating token:", error);
    }
  };

  return (
    <>
      <select value={tokenTime} onChange={handleTimeChange}>
        <option value="5">5 minutes</option>
        <option value="10">10 minutes</option>
        <option value="15">15 minutes</option>
        <option value="30">30 minutes</option>
        <option value="60">1 hour</option>
        <option value="120">2 hours</option>
      </select>
      <button onClick={handleClick}>Generate Token</button>
    </>
  );
}
export default GenerateTokenButton;
