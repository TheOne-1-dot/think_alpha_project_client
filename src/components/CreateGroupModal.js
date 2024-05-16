import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Chip,
  Autocomplete,
} from "@mui/material";
import axios from "axios";

function CreateGroupModal({ open, handleClose, fetchGroups, users, tasks }) {
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    members: [],
  });

  const handleChange = (event) => {
    setGroupData({ ...groupData, [event.target.name]: event.target.value });
  };

  const handleMemberChange = (event, newValue) => {
    setGroupData({ ...groupData, members: newValue });
  };

  const handleChangeTasks = (event, newValue) => {
    setGroupData({ ...groupData, tasks: newValue });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/groups", groupData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchGroups(); // Refresh the list of groups
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Group</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Group Name"
          type="text"
          fullWidth
          variant="outlined"
          value={groupData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          value={groupData.description}
          onChange={handleChange}
        />
        <Autocomplete
          multiple
          options={users || []}
          getOptionLabel={(option) => option.name}
          onChange={handleMemberChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Members"
              placeholder="Add Members"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option.name}
                {...getTagProps({ index })}
              />
            ))
          }
        />

        <Autocomplete
          multiple
          options={tasks || []}
          getOptionLabel={(option) => option.title}
          onChange={handleChangeTasks}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Tasks"
              placeholder="Add Tasks"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option.title}
                {...getTagProps({ index })}
              />
            ))
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateGroupModal;
