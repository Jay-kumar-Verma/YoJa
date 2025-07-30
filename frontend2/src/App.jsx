import { Route, Routes } from "react-router-dom"
import Sidebar from "./Sidebar/Sidebar"

import Profile from "./Pages/Profile"
import RecordAsana from "./Pages/RecordAsana"
import Help from "./Pages/Help"
import DailyChallenges from "./Pages/DailyChallenges"
import DailyClick from "./Pages/DailyClick"
import Attendance from "./Pages/Attendance"
import Asanas from "./Pages/Asanas"
import Mantras from "./Pages/Mantras"
import CalCount from "./Pages/ CalCount"
import Dashboard from "./Pages/Dashboard"


const App = () => {
  return (
  <>

  
 <div className="flex">
      {/* Sidebar is always visible */}
      <Sidebar />

      {/* Pages rendered next to Sidebar */}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/dashborad" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recordAsana" element={<RecordAsana/>}/>
           <Route path="/help" element={<Help/>}/>
            <Route path="/challenges" element={<DailyChallenges/>}/>
             <Route path="/dailyclick" element={<DailyClick/>}/>
              <Route path="/attendance" element={<Attendance/>}/>
              <Route path="/typesOfasanas" element={<Asanas/>}/>
              <Route path="/mantras" element={<Mantras/>}/>
              <Route path="/calories" element={<CalCount/>}/>
        </Routes>
      </div>
    </div>


 
  
</>

  )
}

export default App
