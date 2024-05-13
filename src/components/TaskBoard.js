import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Chip,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentSection from "./CommentSection";

function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  console.log("🚀 ~ TaskBoard ~ tasks:", tasks);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  console.log("🚀 ~ TaskBoard ~ users:", users);
  const [currentTask, setCurrentTask] = useState({
    title: "",
    description: "",
    status: "To Do",
    assignees: [],
  });

  useEffect(() => {
    fetchTasks();
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

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleOpenForCreate = () => {
    setCurrentTask({
      title: "",
      description: "",
      status: "To Do",
      assignee: "",
    });
    setOpen(true);
  };

  const handleOpenForUpdate = (task) => {
    setCurrentTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    const method = currentTask._id ? "put" : "post";
    const assigneesIds = currentTask.assignees.map((assignee) => {
      return assignee._id;
    });
    const updatedTask = {
      ...currentTask,
      assignees: assigneesIds,
    };
    const url = currentTask._id
      ? `http://localhost:5000/api/tasks/${currentTask._id}`
      : "http://localhost:5000/api/tasks";
    try {
      await axios[method](url, updatedTask, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchTasks();
      handleClose();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleInputChange = (e) => {
    setCurrentTask({ ...currentTask, [e.target.name]: e.target.value });
  };

  const handleAssigneeChange = (event, newValue) => {
    const updatedAssignees = newValue.map((user) => user);
    setCurrentTask({ ...currentTask, assignees: updatedAssignees });
  };

  const statuses = ["To Do", "In Progress", "Done"];

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId)); // Remove the task from the local state
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" style={{ margin: "20px 0" }}>
        Tasks
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenForCreate}
        style={{ marginBottom: "20px" }}
      >
        Create New Task
      </Button>
      <Grid container spacing={3}>
        {statuses.map((status) => (
          <Grid item xs={12} md={4} key={status}>
            <Paper style={{ minHeight: 100, padding: 10 }}>
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
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Stop the event from bubbling up to the paper element
                        handleDeleteTask(task._id);
                      }}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        minWidth: "auto",
                        padding: "0",
                      }}
                    >
                      <DeleteIcon />
                    </Button>
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
        <DialogTitle id="form-dialog-title">
          {currentTask._id ? "Update Task" : "Create New Task"}
        </DialogTitle>
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
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {currentTask._id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TaskBoard;
