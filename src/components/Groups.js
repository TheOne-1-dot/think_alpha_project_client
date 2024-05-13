import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import CreateGroupModal from "./CreateGroupModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
    fetchUsers();
    fetchTasks();
  }, []);

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

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/groups", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Group Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Create New Group
      </Button>
      <CreateGroupModal
        open={open}
        handleClose={handleClose}
        fetchGroups={fetchGroups}
        users={users}
        tasks={tasks}
      />
      <List>
        {groups.map((group) => (
          <Paper key={group._id} elevation={2} sx={{ mb: 2 }}>
            <ListItem button onClick={() => navigate(`/groups/${group._id}`)}>
              <ListItemText
                primary={group.name}
                secondary={group.description}
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  );
}

export default Groups;
