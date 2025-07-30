import React from 'react';
import { FaFire, FaRegStar } from "react-icons/fa";
import { FaRegClock, FaArrowTrendUp } from "react-icons/fa6";
import { TbActivityHeartbeat } from "react-icons/tb";
import { FiTarget } from "react-icons/fi";
import { IoPlayOutline, IoCalendarClearOutline } from "react-icons/io5";
import { BiVideoRecording } from "react-icons/bi";
import { GiAchievement } from "react-icons/gi";

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-orange-50 text-gray-800">
            {/* Welcome Section */}
            <div className="py-6 px-10">
                <h1 className="text-3xl font-bold">Welcome back, Sarah! 🧘‍♀️</h1>
                <p className="text-gray-600 mt-1">Ready for today's yoga practice? Let's maintain that streak!</p>
            </div>

            {/* Stats Cards */}
            <div className="px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Current Streak', value: '12 Days', icon: <FaFire />, color: 'bg-red-500 border-red-400' },
                    { title: 'Practice Time', value: '45 min', icon: <FaRegClock />, color: 'bg-blue-400 border-blue-400' },
                    { title: 'Calories Burned', value: '320', icon: <TbActivityHeartbeat />, color: 'bg-teal-300 border-teal-300' },
                    { title: 'Weekly Goal', value: '5/7', icon: <FiTarget />, color: 'bg-orange-300 border-orange-300' },
                ].map((card, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white shadow-sm rounded-xl border border-gray-200">
                        <div>
                            <h3 className="text-sm text-gray-500">{card.title}</h3>
                            <h2 className="text-xl font-bold mt-1">{card.value}</h2>
                        </div>
                        <div className={`text-white text-4xl p-3 rounded-full ${card.color}`}>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Goals and Quick Actions */}
            <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Goals */}
<div className="col-span-2 bg-gradient-to-br from-white to-orange-50 border border-gray-200 rounded-xl p-6 shadow-sm">
    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><FiTarget className="text-2xl text-blue-500" /> Today's Goals</h2>

    {/* Morning Yoga Session */}
    <div className="mt-5">
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-800">Morning Yoga Session</p>
            <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-600 rounded-full border border-green-200">
                Completed
            </span>
        </div>
        <div className="w-full h-2 bg-pink-100 rounded-full mt-2">
            <div className="h-2 bg-sky-400 rounded-full w-full transition-all duration-500"></div>
        </div>
    </div>

    {/* Mindfulness Practice */}
    <div className="mt-5">
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-800">Mindfulness Practice</p>
            <span className="text-sm text-gray-600">15/20 min</span>
        </div>
        <div className="w-full h-2 bg-pink-100 rounded-full mt-2">
            <div className="h-2 bg-sky-400 rounded-full w-[75%] transition-all duration-500"></div>
        </div>
    </div>

    {/* Water Intake */}
    <div className="mt-5">
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-800">Water Intake</p>
            <span className="text-sm text-gray-600">6/8 glasses</span>
        </div>
        <div className="w-full h-2 bg-pink-100 rounded-full mt-2">
            <div className="h-2 bg-sky-400 rounded-full w-[75%] transition-all duration-500"></div>
        </div>
    </div>
</div>


                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="flex flex-col gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
                            <BiVideoRecording /> Record New Session
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-blue-100">
                            <IoCalendarClearOutline /> View Calendar
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-blue-100">
                            <FaArrowTrendUp /> Check Progress
                        </button>
                    </div>
                </div>
            </div>

            {/* Suggested Practices & Weekly Summary */}
            <div className="px-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Suggested Practices */}
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-teal-600"><FaRegStar /> Suggested for You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                        {[
                            { title: 'Sun Salutation', level: 'Beginner', tag: 'Energy • 10 min' },
                            { title: 'Warrior Flow', level: 'Intermediate', tag: 'Strength • 15 min' },
                            { title: 'Evening Stretch', level: 'Beginner', tag: 'Relaxation • 8 min' },
                            { title: 'Core Balance', level: 'Intermediate', tag: 'Stability • 12 min' },
                        ].map((item, i) => (
                            <div key={i} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                <div className="flex justify-between items-center font-semibold">
                                    <h3>{item.title}</h3>
                                    <span className="text-sm px-2 py-0.5 rounded-full border">{item.level}</span>
                                </div>
                                <p className="text-gray-500 text-sm mt-1">{item.tag}</p>
                                <button className="mt-4 w-full px-4 py-2 border rounded-lg font-semibold text-gray-700 hover:bg-blue-400 hover:text-white flex items-center justify-center gap-2">
                                    <IoPlayOutline /> Start Practice
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Summary */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold flex items-center gap-2"><IoCalendarClearOutline /> This Week</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        {[
                            ['Mon', 'Completed'],
                            ['Tue', 'Completed'],
                            ['Wed', 'Completed'],
                            ['Thur', 'Completed'],
                            ['Fri', 'Completed'],
                            ['Sat', 'Pending'],
                            ['Sun', 'Pending'],
                        ].map(([day, status], i) => (
                            <div key={i} className="flex justify-between">
                                <span>{day}</span>
                                <span className={`px-3 py-0.5 rounded-full text-xs font-semibold
                                    ${status === 'Completed' ? 'bg-green-200 text-green-600' : 'bg-gray-200 text-gray-600'}
                                `}>
                                    {status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Achievement */}
            <div className="p-10 flex justify-end">
                <div className="w-full md:w-2/5 bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
                    <h2 className="text-xl font-bold">Recent Achievement</h2>
                    <GiAchievement className="text-6xl text-orange-500 mt-4" />
                    <h3 className="font-bold mt-4 text-lg">Consistency Master!</h3>
                    <p className="text-gray-600">You've practiced yoga for 7 days straight</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
