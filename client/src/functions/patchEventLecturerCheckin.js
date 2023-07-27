function patchEventLecturerCheckin(eventId, userId, userStatus) {
  const url = `/api/events/${eventId}/${userId}`;

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

export default patchEventLecturerCheckin;
