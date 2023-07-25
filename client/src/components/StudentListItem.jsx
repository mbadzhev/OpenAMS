import { useNavigate } from "react-router-dom";

function StudentListItem({ student }) {
  const navigate = useNavigate();

  function handleStudentClick() {
    navigate(`/student/${student._id}`);
  }

  return (
    <>
      <h3>
        {student.firstName} {student.lastName} ({student.number})
      </h3>
      <button onClick={handleStudentClick}>View Details</button>
    </>
  );
}

export default StudentListItem;
