import { useContext } from "react";
import UserContext from "../contexts/UserContext";

// Components
import ModuleListItem from "../components/ModuleListItem";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function ModuleList() {
  const userData = useContext(UserContext);
  return (
    <Container className="my-md-3 py-3 bg-component rounded">
      <Row>
        <Col>
          <h1 className="text-center">Module List</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          {userData.modules.map((module) => (
            <ModuleListItem key={module._id} module={module} />
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default ModuleList;
