import { useNavigate } from "react-router-dom";

// Components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function StudentListItem({ student }) {
  const navigate = useNavigate();

  function handleStudentClick() {
    navigate(`/student/${student._id}`);
  }

  return (
    <Row className="my-2">
      <Col md={8} xs={12}>
        <h4>
          {student.firstName} {student.lastName} ({student.number})
        </h4>
      </Col>
      <Col md={4} xs={12} className="text-end">
        <Button variant="primary" onClick={handleStudentClick}>
          View Details
        </Button>
      </Col>
    </Row>
  );
}

export default StudentListItem;
