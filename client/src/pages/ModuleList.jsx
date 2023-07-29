import { useState, useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext";

// Components
import ModuleListItem from "../components/ModuleListItem";

function ModuleList() {
  const userData = useContext(UserContext);
  return (
    <>
      <ul>
        {userData.modules.map((module) => (
          <ModuleListItem key={module._id} module={module} />
        ))}
      </ul>
    </>
  );
}

export default ModuleList;
