/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import axios from "axios";
import GroupTaskBoard from "./GroupTaskBoard";

function GroupDetails() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/groups/${groupId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setGroup(response.data);
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate(`/groups`);
      // Redirect or update UI post deletion
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  if (!group) {
    return <Typography>Loading group details...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        {group.name}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {group.description}
      </Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Members</Typography>

          <Typography variant="body2" color="textSecondary">
            Group members: {group?.members?.map((a) => a.name).join(", ")}
          </Typography>
        </CardContent>
      </Card>

      {/* Pass the tasks of the group to the TaskBoard component */}
      <GroupTaskBoard tasks={group.tasks} />

      <Button variant="contained" color="secondary" onClick={handleDeleteGroup}>
        Delete Group
      </Button>
    </Container>
  );
}

export default GroupDetails;
