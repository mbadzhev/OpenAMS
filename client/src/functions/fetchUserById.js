async function fetchUserById(userId = "") {
  try {
    const url = userId ? `/api/users/${userId}` : "/api/users";
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

export default fetchUserById;
