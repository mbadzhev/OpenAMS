import { useState, useEffect, useContext } from "react";

// Components
import StudentListItem from "../components/StudentListItem";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Functions
import fetchModule from "../functions/fetchModule";

// Contexts
import UserContext from "../contexts/UserContext";

function StudentList() {
  const userData = useContext(UserContext);
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    if (userData) {
      getModuleData(userData.modules);
    }
  }, [userData]);

  async function getModuleData(modules) {
    setLoading(true);
    setError(null);
    try {
      const moduleDataPromises = modules.map((module) =>
        fetchModule(module._id)
      );
      const allModuleData = await Promise.all(moduleDataPromises);
      // Convert the array of module data into an object with _id as the keys
      const moduleDataObject = allModuleData.reduce((acc, data, index) => {
        acc[modules[index]._id] = data;
        return acc;
      }, {});
      setModuleData(moduleDataObject);
    } catch (error) {
      setError(error.message);
      setModuleData({});
    } finally {
      setLoading(false);
    }
  }

  // Create a set to store unique student IDs
  const uniqueStudents = new Set();

  // Function to handle search query change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  function handleModuleSelect(moduleId) {
    setSelectedModule(moduleId);
  }

  // Filter students based on search query and selected module
  const filteredStudents = [];
  if (moduleData) {
    Object.keys(moduleData).forEach((moduleId) => {
      if (selectedModule === null || moduleId === selectedModule) {
        // Show students from all modules if selectedModule is null or matches the moduleId
        moduleData[moduleId].students.forEach((student) => {
          const studentNumber = String(student.number); // Convert number to string
          if (
            student.firstName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            student.lastName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            studentNumber.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            // Check if the student ID is already in the uniqueStudents set
            if (!uniqueStudents.has(student._id)) {
              // Add the student ID to the set to prevent duplicates
              uniqueStudents.add(student._id);
              filteredStudents.push(student);
            }
          }
        });
      }
    });
  }

  // Get the name of the selected module, or null if all modules are shown
  const selectedModuleCode =
    selectedModule === null
      ? "All Modules"
      : userData.modules.find((module) => module._id === selectedModule)?.code;

  // Determine the search filter text
  let searchFilterText = "";
  if (searchQuery) {
    searchFilterText = `"${searchQuery}"`;
    if (selectedModuleCode) {
      searchFilterText += ` in "${selectedModuleCode}"`;
    }
  } else if (selectedModuleCode) {
    searchFilterText = `All Students in "${selectedModuleCode}"`;
  } else {
    searchFilterText = "All Students";
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return (
      <h1>{`There is a problem fetching the requested data - ${error}`}</h1>
    );
  }

  return (
    <Container className="my-md-3 py-3 bg-component rounded">
      <Row className="mb-3">
        <h1 className="pb-3 text-center">Student List: {searchFilterText}</h1>
        <Col>
          <Form.Control
            className="m-1"
            type="text"
            placeholder="Search by student name or number"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </Col>
        <Col>
          <Button
            className="m-1"
            variant="primary"
            onClick={() => handleModuleSelect(null)}
          >
            All Modules
          </Button>
          {userData &&
            userData.modules.map((module) => (
              <Button
                className="m-1"
                variant="primary"
                key={module._id}
                onClick={() => handleModuleSelect(module._id)}
              >
                {module.code}
              </Button>
            ))}
        </Col>
      </Row>

      {filteredStudents.length === 0 ? (
        <h4>No matching students found.</h4>
      ) : (
        filteredStudents.map((student) => (
          <StudentListItem key={student._id} student={student} />
        ))
      )}
    </Container>
  );
}

export default StudentList;
