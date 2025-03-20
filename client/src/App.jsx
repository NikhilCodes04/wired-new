import { Routes, Route } from "react-router";
import Home from "./components/Home/Home.jsx";
import About from "./components/About/About.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import AddProject from "./components/AddProject/AddProject.jsx";
import ViewProjects from "./components/ViewProjects/ViewProjects.jsx";
import ProjectPage from "./components/ProjectPage/ProjectPage.jsx";
import Profile from "./components/Profile/Profile.jsx";
import ViewRequests from "./components/ViewRequests/ViewRequests.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested route for AddProject */}
          <Route path="add-project" element={<AddProject />} />
          <Route path="view-projects" element={<ViewProjects />} />
          <Route path="view-projects/:id" element={<ProjectPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="view-requests" element={<ViewRequests />} />
        </Route>
        {/* <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/find-teammates"
          element={
            <ProtectedRoute>
              <FindTeammates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/find-mentor"
          element={
            <ProtectedRoute>
              <FindMentor />
            </ProtectedRoute>
          }
        />
        <Route path="/view-requests" element={<ViewRequests />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/view-project" element={<ViewProjects />} /> */}


      </Routes>

      {/* <div>Hello</div> */}
    </>
  );
}



export default App;