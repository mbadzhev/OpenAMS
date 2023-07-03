async function createToken(tokenData) {
  try {
    const url = `/api/tokens`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tokenData),
    });

    if (response.ok) {
      return response.status;
    } else {
      const error = await response.json();
      throw new Error(error.error);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export default createToken;
