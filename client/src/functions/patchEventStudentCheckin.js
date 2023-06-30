async function patchEventStudentCheckin(eventId, userId, code) {
  console.log(eventId);
  console.log(userId);
  console.log(code);
  try {
    const url = `/api/events/${eventId}/${userId}/${code}`;
    const response = await fetch(url, {
      method: "PATCH",
    });
    if (!response.ok) {
      throw new Error(
        `This is an HTTP error: The status is ${response.status}`
      );
    }
    return response.status;
  } catch (error) {
    throw new Error(`There is a problem patching the data - ${error}`);
  }
}

export default patchEventStudentCheckin;
