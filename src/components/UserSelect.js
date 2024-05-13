import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
} from "@mui/material";

function UserSelect(assignees, setAssignees, users) {
  if (!users) return null; // or return a loading spinner

  const handleChange = (event) => {
    setAssignees(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="assignee-select-label">Assignees</InputLabel>
      <Select
        labelId="assignee-select-label"
        multiple
        value={assignees}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label="Assignees" />}
        renderValue={(selected) => (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={
                  users.find((user) => user._id === value)?.username || value
                }
              />
            ))}
          </div>
        )}
      >
        {users.map((user) => (
          <MenuItem key={user._id} value={user._id}>
            {user.username}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default UserSelect();
