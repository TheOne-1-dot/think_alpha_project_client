import {
  Autocomplete,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CommentSection from "./CommentSection";
import { green, yellow, blue } from "@mui/material/colors";

function GroupTaskBoard({ tasks = [] }) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentTask, setCurrentTask] = useState({
    title: "",
    description: "",
    status: "To Do",
    assignees: [],
  });

  
  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return yellow[600]; // Adjust the color as needed
      case "In Progress":
        return blue[300]; // Adjust the color as needed
      case "Done":
        return green[500]; // Adjust the color as needed
      default:
        return blue[100];
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/allUsers",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };



  const handleOpenForUpdate = (task) => {
    setCurrentTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setCurrentTask({ ...currentTask, [e.target.name]: e.target.value });
  };

  const handleAssigneeChange = (event, newValue) => {
    const updatedAssignees = newValue.map((user) => user);
    setCurrentTask({ ...currentTask, assignees: updatedAssignees });
  };

  const statuses = ["To Do", "In Progress", "Done"];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" style={{ margin: "20px 0" }}>
        Tasks
      </Typography>

      <Grid container spacing={3}>
        {statuses.map((status) => (
          <Grid item xs={12} md={4} key={status}>
            <Paper style={{ minHeight: 100, padding: 10,   backgroundColor: getStatusColor(status), }}>
              <Typography variant="h6">{status}</Typography>
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <Paper
                    key={task._id}
                    style={{
                      position: "relative",
                      margin: "10px 0",
                      padding: "10px",
                    }}
                    onClick={(e) => {
                      // Prevent the delete action from triggering the update action
                      if (
                        e.target.tagName !== "BUTTON" &&
                        e.target.tagName !== "SVG" &&
                        e.target.tagName !== "PATH"
                      ) {
                        handleOpenForUpdate(task);
                      }
                    }}
                  >
                    <Typography variant="subtitle1">{task.title}</Typography>
                    <Typography variant="body2">{task.description}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Assigned to:{" "}
                      {task?.assignees?.map((a) => a.name).join(", ")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Created by: {task?.creator?.name}
                    </Typography>
                  </Paper>
                ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{currentTask.title}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            name="title"
            value={currentTask.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            name="description"
            value={currentTask.description}
            onChange={handleInputChange}
          />
          <TextField
            select
            label="Status"
            fullWidth
            name="status"
            value={currentTask.status}
            onChange={handleInputChange}
          >
            {statuses.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {users.length > 0 && (
            <Autocomplete
              multiple
              id="tags-outlined"
              options={users}
              getOptionLabel={(option) => option.name}
              defaultValue={currentTask.assignees?.map((assignees) =>
                users.find((u) => u._id === assignees._id)
              )}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Assignees" />
              )}
              onChange={handleAssigneeChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          )}
          <CommentSection taskId={currentTask._id} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default GroupTaskBoard;
