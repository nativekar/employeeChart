import React, { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onSearch = async () => {
    let employees = await getEntireList(name);
    employees = Array.from(new Set(employees));
    setUsers(employees);
  };

  const getEntireList = async (employeeName) => {
    let reporters = await getNames(employeeName);
    if (reporters && reporters.length > 0) {
      const len = reporters.length;
      for (let i = 0; i < len; i++) {
        let data = await getEntireList(reporters[i]);
        if (data && data.length > 0) {
          reporters = [...reporters, ...data];
        }
      }
      return reporters;
    }
    return reporters;
  };

  const getNames = async (employeeName) => {
    return await fetch(
      `http://api.additivasia.io/api/v1/assignment/employees/${employeeName}`
    )
      .then((res) => res.json())
      .then((response) => {
        if (response && response.length > 1) {
          return response[1]["direct-subordinates"];
        } else {
          return [];
        }
      });
  };

  return (
    <div className="App">
      <div>
        <input type="text" onChange={onNameChange} value={name} />
        <button onClick={onSearch}>Search</button>
      </div>
      <div className="subordinates-list">
        {users && users.map((user) => <p key={user}>{user}</p>)}
      </div>
    </div>
  );
}

export default App;
