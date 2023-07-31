async function fetchUserByEmail(userEmail) {
  try {
    const url = `/api/users/email/${userEmail}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `This is an HTTP error: The status is ${response.status}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error(
      `There is a problem fetching the requested data - ${error}`
    );
  }
}

export default fetchUserByEmail;
