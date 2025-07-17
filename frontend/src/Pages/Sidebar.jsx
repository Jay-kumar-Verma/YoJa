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
  { to: "/feed", icon: <FaHome className="text-xl" />, label: "Daily Feed" },
  { to: "/profile", icon: <FaUser className="text-xl" />, label: "Profile" },
  { to: "/asanas", icon: <FaBookOpen className="text-xl" />, label: "Asanas" },
  { to: "/record", icon: <FaCamera className="text-xl" />, label: "Record Asana" },
  { to: "/challenges", icon: <FaBullseye className="text-xl" />, label: "Daily Challenges" },
  { to: "/attendance", icon: <FaCalendarAlt className="text-xl" />, label: "Attendance" },
  { to: "/calories", icon: <FaUtensils className="text-xl" />, label: "Calorie Counter" },
  { to: "/mantras", icon: <FaMusic className="text-xl" />, label: "Yoga Mantras" },
  { to: "/help", icon: <FaQuestionCircle className="text-xl" />, label: "Help & Support" },
];

const Sidebar = () => (
  <aside className="w-80 min-h-screen bg-white shadow-lg flex flex-col px-8 py-6">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-sky-600">YoJa</h1>
      <p className="text-gray-500 text-sm mt-1">AI-Powered Yoga Platform</p>
    </div>

    <div className="mb-6">
      <NavLink
        to="/search"
        className="flex items-center gap-2 text-sky-600 font-medium hover:underline"
      >
        <FaSearch className="text-lg" />
        <span>Search</span>
      </NavLink>
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
