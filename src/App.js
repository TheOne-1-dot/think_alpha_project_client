import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskBoard from "./components/TaskBoard";
import TaskDetails from "./components/TaskDetails";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Home from "./components/Home";
import Groups from "./components/Groups";
import GroupDetails from "./components/GroupDetails";
import Footer from "./components/Footer";
import { CssBaseline, Box, Container } from "@mui/material";

function App() {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Router>
          <Navbar />
          <Container component="main" sx={{ flex: 1 }}>
            <Routes>
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/tasks" /> : <Login />}
              />
              <Route
                path="/register"
                element={
                  isAuthenticated ? <Navigate to="/tasks" /> : <Register />
                }
              />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks/:taskId"
                element={
                  <PrivateRoute>
                    <TaskDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <PrivateRoute>
                    <TaskBoard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/groups"
                element={
                  <PrivateRoute>
                    <Groups />
                  </PrivateRoute>
                }
              />
              <Route
                path="/groups/:groupId"
                element={
                  <PrivateRoute>
                    <GroupDetails />
                  </PrivateRoute>
                }
              />

              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Container>
          <Footer />
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;