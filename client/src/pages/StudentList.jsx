import { useState, useEffect, useContext } from "react";

// Components
import StudentListItem from "../components/StudentListItem";

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
    <div>
      <input
        type="text"
        placeholder="Search by name or student number"
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
      <div>
        <button onClick={() => handleModuleSelect(null)}>
          Show All Modules
        </button>
        {userData &&
          userData.modules.map((module) => (
            <button
              key={module._id}
              onClick={() => handleModuleSelect(module._id)}
            >
              {module.code}
            </button>
          ))}
      </div>
      <h2>Student List for {searchFilterText}</h2>

      {filteredStudents.length === 0 ? (
        <p>No matching students found.</p>
      ) : (
        filteredStudents.map((student) => (
          <StudentListItem key={student._id} student={student} />
        ))
      )}
    </div>
  );
}

export default StudentList;
