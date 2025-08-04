import {
  FaHome,
  FaUser,
  FaBookOpen,
  FaCamera,
  FaBullseye,
  FaCalendarAlt,
  FaUtensils,
  FaMusic,
  FaQuestionCircle,
  FaSearch,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", icon: <FaHome className="text-xl" />, label: "Dashboard" },
  { to: "/dashboard/profile", icon: <FaUser className="text-xl" />, label: "Profile" },
  { to: "/dashboard/typesOfasanas", icon: <FaBookOpen className="text-xl" />, label: "Asanas" },
  { to: "/dashboard/recordAsana", icon: <FaCamera className="text-xl" />, label: "Record Asana" },
  { to: "/dashboard/challenges", icon: <FaBullseye className="text-xl" />, label: "Daily Challenges" },
  { to: "/dashboard/attendance", icon: <FaCalendarAlt className="text-xl" />, label: "Attendance" },
  { to: "/dashboard/calories", icon: <FaUtensils className="text-xl" />, label: "Calorie Counter" },
  { to: "/dashboard/mantras", icon: <FaMusic className="text-xl" />, label: "Yoga Mantras" },
  { to: "/dashboard/help", icon: <FaQuestionCircle className="text-xl" />, label: "Help & Support" },
];

const Sidebar = () => (
  <aside className="w-80 min-h-screen bg-white shadow-lg flex flex-col px-8 py-6">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-sky-600">YoJa</h1>
      <p className="text-gray-500 text-sm mt-1">AI-Powered Yoga Platform</p>
    </div>

    <div className="mb-6">
  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
    <FaSearch className="text-gray-500 text-lg" />
    <input
      type="text"
      placeholder="Search"
      className="bg-transparent outline-none text-sm w-full text-gray-700"
     
    />
  </div>
</div>


    <nav className="flex flex-col gap-2">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
              isActive
                ? "bg-blue-100 text-sky-700"
                : "text-gray-700 hover:bg-blue-50"
            }`
          }
        >
          {icon}
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
