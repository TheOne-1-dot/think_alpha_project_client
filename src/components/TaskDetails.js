import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper, TextField, Button } from "@mui/material";
import axios from "axios";
import CommentSection from "./CommentSection";

function TaskDetails() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchTask();
  }, [taskId]);

  if (!task) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: "20px", margin: "20px 0" }}>
        <Typography variant="h4">{task.title}</Typography>
        <Typography variant="subtitle1">{task.description}</Typography>
        <Typography variant="body2">Status: {task.status}</Typography>
        <CommentSection taskId={taskId} />
      </Paper>
    </Container>
  );
}

export default TaskDetails;
