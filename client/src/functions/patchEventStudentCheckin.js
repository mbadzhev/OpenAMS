function patchEventStudentCheckin(eventId, userId, code) {
  const url = `/api/events/${eventId}/${userId}/${code}`;
  fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update data");
      }
      return response.json();
    })
    .then((responseData) => {})
    .catch((error) => {
      console.error(error);
    });
}

export default patchEventStudentCheckin;
