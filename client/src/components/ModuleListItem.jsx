import { useNavigate } from "react-router-dom";

function ModuleListItem({ module }) {
  const navigate = useNavigate();

  function handleModuleClick() {
    navigate(`/module/${module._id}`);
  }
  return (
    <li key={module._id}>
      {module && (
        <>
          <p>
            {module.code} - {module.name}
          </p>
          <button onClick={handleModuleClick}>View Details</button>
        </>
      )}
    </li>
  );
}

export default ModuleListItem;
