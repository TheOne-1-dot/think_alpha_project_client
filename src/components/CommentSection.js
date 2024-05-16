import React, { useEffect, useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";

function CommentSection({ taskId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async (taskId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comments/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if(taskId){

      fetchComments(taskId);
    }
  }, [taskId]);

  const addComment = async () => {
    if (!newComment) return;
    try {
      await axios.post(
        `http://localhost:5000/api/comments/${taskId}`,
        {
          content: newComment,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchComments(taskId);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Comments</Typography>
      {comments.map((comment) => (
        <Typography
          key={comment._id}
        >{`${comment.content} - comment by ${comment.creator.name}`}</Typography>
      ))}
      <TextField
        label="New Comment"
        fullWidth
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button onClick={addComment} color="primary" variant="contained">
        Add Comment
      </Button>
    </div>
  );
}

export default CommentSection;
