import React from "react";

const Profile = () => (
  <div className="min-h-screen bg-blue-50 px-4 py-6">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Profile</h1>
        <p className="text-gray-400 text-base">
          Manage your personal information and yoga journey
        </p>
      </div>
      <button className="flex items-center gap-2 bg-gradient-to-br border border-slate-200 from-blue-300 to-blue-400 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg hover:-translate-y-1 transition-transform">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
        </svg>
        Edit Profile
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="flex flex-col gap-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow p-8 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-300 to-blue-400 flex items-center justify-center text-white text-3xl font-bold mb-4">
            SC
          </div>
          <div className="text-xl font-semibold text-gray-800">Sarah Chen</div>
          <div className="text-gray-400 text-sm mb-2">sarah.chen@example.com</div>
          <span className="bg-blue-50 border text-blue-400 text-xs px-3 py-1 rounded-full font-medium">
            Intermediate Practitioner
          </span>
        </div>
        {/* Stats Cards */}
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow p-6 flex flex-col items-center hover:-translate-y-1 transition-transform">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-300 flex items-center justify-center mb-2">
              <svg class="w-[20px] h-[20px] fill-[#ffff]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32V288c0 17.7-14.3 32-32 32s-32-14.3-32-32V205.3L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160H384z"></path>
              </svg>
            </span>
            <div className="text-2xl font-bold text-gray-800">156</div>
            <div className="text-gray-400 text-sm">Total Sessions</div>
          </div>
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow p-6 flex flex-col items-center hover:-translate-y-1 transition-transform">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-red-400  flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
            </span>
            <div className="text-2xl font-bold text-gray-800">12 days</div>
            <div className="text-gray-400 text-sm">Current Streak</div>
          </div>
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow p-6 flex flex-col items-center hover:-translate-y-1 transition-transform">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-green-300 flex items-center justify-center mb-2">
              <svg class="w-[20px] h-[20px] fill-[#ffff]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"></path>
              </svg>
            </span>
            <div className="text-lg font-bold text-gray-800">Warrior II</div>
            <div className="text-gray-400 text-sm">Favorite Pose</div>
          </div>
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow p-6 flex flex-col items-center hover:-translate-y-1 transition-transform">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center mb-2">
              <svg class="w-[20px] h-[20px] fill-[#ffff]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32V288c0 17.7-14.3 32-32 32s-32-14.3-32-32V205.3L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160H384z"></path>
              </svg>
            </span>
            <div className="text-2xl font-bold text-gray-800">48 hrs</div>
            <div className="text-gray-400 text-sm">Time Practiced</div>
          </div>
        </div>
      </div>
      {/* Right Column */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow p-8 hover:-translate-y-1 transition-transform">
          <h2 className="text-3xl font-medium text-gray-800 mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-500 text-sm mb-1">Full Name</label>
              <input class="placeholder:font-medium placeholder:text-slate-300 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-blue-300 focus:ring-1 sm:text-sm" placeholder="Enter your name" type="text" name="search" />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Email</label>
              <input class="placeholder:font-medium placeholder:text-slate-300 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-blue-300 focus:ring-1 sm:text-sm" placeholder="Enter your email" type="text" name="search" />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Age</label>
              <input class="placeholder:font-medium placeholder:text-slate-300 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-blue-300 focus:ring-1 sm:text-sm" placeholder="Enter your Age" type="text" name="search" />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Height</label>
              <input class="placeholder:font-medium placeholder:text-slate-300 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-blue-300 focus:ring-1 sm:text-sm" placeholder="Enter your Heignt" type="text" name="search" />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Weight</label>
              <input class="placeholder:font-medium placeholder:text-slate-300 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-blue-300 focus:ring-1 sm:text-sm" placeholder="Enter your weight" type="text" name="search" />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Gender</label>
              <select id="options" name="options" className="block w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-slate-300 font-medium focus:outline-none focus:ring-2 focus:border-sky-500 focus:ring-blue-300">
                <option value="" disabled selected hidden>Select your Gender</option>
                <option value="Male" className="text-black">Male</option>
                <option value="Female" className="text-black">Female</option>
                <option value="Others" className="text-black">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Yoga Level</label>
              <select id="options" name="options" className="block w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-slate-300 font-medium focus:outline-none focus:ring-2 focus:border-sky-500 focus:ring-blue-300">
                <option value="" disabled selected hidden>Select your Yoga</option>
                <option value="Beginner" className="text-black">Beginner</option>
                <option value="Intermediate" className="text-black">Intermediate</option>
                <option value="Professional" className="text-black">Professional</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-500 text-sm mb-1">Yoga Goals</label>
              <input class="placeholder:font-medium placeholder:text-slate-300 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-blue-300 focus:ring-1 sm:text-sm" placeholder="Enter your Yoga Goals" type="text" name="search" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;