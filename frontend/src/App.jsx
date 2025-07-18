import { Route, Routes } from "react-router-dom"
import Login from "./Pages/Login"
import ForgotPassword from "./Pages/ForgotPassword"
import Footer from "./ Layouts/Footer"
import Navbar from "./ Layouts/Navbar"
import Home from "./Pages/Home"
import About from "./Pages/About"
import Asanas from "./Pages/Asanas"
import Contact from "./Pages/Contact"
import Demo from "./Pages/demo"
import Blog from "./Pages/Blog"
import Help from "./Pages/Help"
import Sidebar from "./Pages/Sidebar"
import Profile from "./Pages/Profile"
import Cal_Count from "./Pages/Cal_Count"

const App = () => {
  return (
  <>
  <Navbar/>

  <Routes>
    <Route path="/" element={<Home/>}  />
     <Route path="/about" element={<About/>}  />
    <Route path="/forgot-password" element={<ForgotPassword/>} />
     <Route path="/login" element={<Login />} />
      <Route path="/asanas" element={<Asanas/>}  />
      <Route path="/contact" element={<Contact/>}  />
      <Route path="/demo" element={<Demo/>} />
      <Route path="/blog" element={<Blog/>} />
      <Route path="/help" element={<Help/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/sidebar" element={<Sidebar/>}/>
      <Route path="/Cal_Count" element={<Cal_Count />} />
      

  </Routes>

 
    <Footer />
</>

  )
}

export default App
