import { useNavigate } from "react-router-dom";

// Components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function ModuleListItem({ module }) {
  const navigate = useNavigate();

  function handleModuleClick() {
    navigate(`/module/${module._id}`);
  }
  return (
    <Row className="mb-4" key={module._id}>
      {module && (
        <>
          <Col md={8} xs={12}>
            <h2>
              {module.name} ({module.code})
            </h2>
          </Col>
          <Col md={4} xs={12} className="d-md-flex justify-content-md-end">
            <Button variant="primary" onClick={handleModuleClick}>
              View Details
            </Button>
          </Col>
        </>
      )}
    </Row>
  );
}

export default ModuleListItem;
