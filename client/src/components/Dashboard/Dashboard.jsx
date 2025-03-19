import Top from "../Home/Top";
import { NavLink, Outlet } from "react-router"; // Corrected import for NavLink

function Dashboard() {
    return (
        <div>
            <Top />
            <div className="grid grid-cols-4 gap-4 p-4"> {/* Flexbox grid with 4 columns */}
                <NavLink to="add-project" end className="bg-indigo-600 text-white p-4 rounded-lg text-center hover:bg-indigo-700 transition-colors">
                    <div>Add a Project</div>
                </NavLink>
                <NavLink to="view-projects" end className="bg-indigo-600 text-white p-4 rounded-lg text-center hover:bg-indigo-700 transition-colors">
                    <div>View Projects</div>
                </NavLink>
                <NavLink to="view-requests" end className="bg-indigo-600 text-white p-4 rounded-lg text-center hover:bg-indigo-700 transition-colors">
                    <div>View Requests</div>
                </NavLink>
                <NavLink to="profile" end className="bg-indigo-600 text-white p-4 rounded-lg text-center hover:bg-indigo-700 transition-colors">
                    <div>Profile</div>
                </NavLink>
            </div>
            <Outlet />
        </div>
    );
}

export default Dashboard;