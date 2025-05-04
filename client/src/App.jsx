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
import DefaultComponent from "./components/DefaultComponenent/DefaultComponent.jsx";
import FindTeammates from "./components/FindTeammates/FindTeammates.jsx";
import FindMentors from "./components/FindMentors/FindMentors.jsx";
import Admin from "./components/Admin/AdminPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin" element={<Admin />} />

        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
          <Route index element={<DefaultComponent />} />
          <Route path="add-project" element={<AddProject />} />
          <Route path="view-projects" element={<ViewProjects />} />
          <Route path="view-projects/:id" element={<ProjectPage />} />
          <Route path="view-projects/:id/find-teammates" element={<FindTeammates />} />
          <Route path="view-projects/:id/find-mentor" element={<FindMentors />} />
          <Route path="profile" element={<Profile />} />
          <Route path="view-requests" element={<ViewRequests />} />
        </Route>


      </Routes>

    </>
  );
}



export default App;