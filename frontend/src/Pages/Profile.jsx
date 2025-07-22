import React from "react";

const Profile = () => {
  const achievements = [
    { title: "First Steps", desc: "Complete your first yoga session", earned: true },
    { title: "Week Warrior", desc: "Maintain a 7-day streak", earned: true },
    { title: "Flexibility Master", desc: "Complete 30-day flexibility challenge", earned: true },
    { title: "Balance Expert", desc: "Perfect 10 balance poses", earned: false },
    { title: "Mindful Month", desc: "Practice for 30 consecutive days", earned: false },
    { title: "Yoga Guru", desc: "Complete 100 yoga sessions", earned: true },
  ];

  const activities = [
    { title: "Completed Morning Flow", time: "Today", duration: "25 min" },
    { title: "Strength Building Challenge", time: "Yesterday", duration: "30 min" },
    { title: "Flexibility Session", time: "2 days ago", duration: "20 min" },
    { title: "Meditation & Mantras", time: "3 days ago", duration: "15 min" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
       
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0084c6]">Your Profile</h1>
          <p className="text-gray-600 mt-2">Track your progress and celebrate your achievements</p>
        </div>

      
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-200"></div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Alex Johnson</h2>
              <p className="text-sm text-blue-600">@alexwellness</p>
              <p className="text-sm text-gray-500 mt-1">Joined January 2024</p>
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">15 Day Streak</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">127 Sessions</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">47h Practice</span>
              </div>
            </div>
          </div>
          <button className="mt-4 md:mt-0 bg-[#0084c6] hover:bg-[#0072b0] text-white px-5 py-2 rounded-md text-sm">
            Edit Profile
          </button>
        </div>


        <div className="grid md:grid-cols-3 gap-6">
        
          <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-[#0084c6] mb-4">Yoga Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-[#0084c6]">
              <div>
                <p className="text-2xl font-bold">127</p>
                <p className="text-sm">Total Sessions</p>
              </div>
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm">Longest Streak</p>
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm">Challenges</p>
              </div>
              <div>
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm">Hours</p>
              </div>
            </div>
            <div className="mt-6 bg-blue-50 text-blue-800 rounded-md px-4 py-2 text-sm">
              Favorite Asana: <strong>Warrior II</strong>
            </div>
          </div>

        
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-[#0084c6] mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              {activities.map((act, idx) => (
                <div key={idx} className="flex justify-between items-center bg-blue-50 px-4 py-2 rounded">
                  <div>
                    <p className="text-gray-700">{act.title}</p>
                    <p className="text-gray-400 text-xs">{act.time}</p>
                  </div>
                  <span className="text-blue-700">{act.duration}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 border border-[#0084c6] text-[#0084c6] rounded-md py-2 hover:bg-blue-50 text-sm">
              View All Activity
            </button>
          </div>
        </div>

      
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-[#0084c6] mb-4">🏆 Achievements</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((ach, idx) => (
              <div
                key={idx}
                className={`p-4 border rounded-md ${
                  ach.earned
                    ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                <p className="font-semibold">{ach.title}</p>
                <p className="text-sm mt-1">{ach.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
