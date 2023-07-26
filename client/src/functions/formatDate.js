function formatDate(dateString) {
  const dateObj = new Date(dateString);
  const time = `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  const date = `${dateObj.getDate().toString().padStart(2, "0")}/${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dateObj.getFullYear()}`;
  return `${time}, ${date}`;
}
export default formatDate;
