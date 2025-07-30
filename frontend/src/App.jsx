import { Routes, Route } from "react-router-dom";
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";

// Public Pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Demo from "./Pages/Demo";
import Blog from "./Pages/Blog";
import AsanasPage from "./Pages/Asanas";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";

// Dashboard Pages
import Dashboard from "./Dashborads/Dashboard";
import Profile from "./Dashborads/Profile";
import RecordAsana from "./Dashborads/RecordAsana";
import Help from "./Dashborads/Help";
import DailyChallenges from "./Dashborads/DailyChallenges";
import DailyClick from "./Dashborads/DailyClick";
import Attendance from "./Dashborads/Attendance";
import AsanasDashboard from "./Dashborads/Asanas";
import Mantras from "./Dashborads/Mantras";
import CalCount from "./Dashborads/CalCount";

// Layouts
import DashboardLayout from "./Layouts/DashboardLayout";

const App = () => {
  return (
    <>
      {/* Public Layout: Navbar and Footer */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/demo"
          element={
            <>
              <Navbar />
              <Demo />
              <Footer />
            </>
          }
        />
        <Route
          path="/blog"
          element={
            <>
              <Navbar />
              <Blog />
              <Footer />
            </>
          }
        />
        <Route
          path="/asanas"
          element={
            <>
              <Navbar />
              <AsanasPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <>
              <Navbar />
              <ForgotPassword />
              <Footer />
            </>
          }
        />

        {/* Dashboard Layout (No Navbar/Footer) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="recordAsana" element={<RecordAsana />} />
          <Route path="help" element={<Help />} />
          <Route path="challenges" element={<DailyChallenges />} />
          <Route path="dailyclick" element={<DailyClick />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="typesOfasanas" element={<AsanasDashboard />} />
          <Route path="mantras" element={<Mantras />} />
          <Route path="calories" element={<CalCount />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
