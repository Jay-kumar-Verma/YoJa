import React from 'react';
import { Link } from 'react-router-dom';

const DailyClick = () => (
    <div className="max-w-3xl mx-auto p-6">
        <Link to="/daily" >
        <div className="text-blue-600 text-sm mb-4 inline-block">
             &larr; Back to Challenges
        </div>
       
        </Link>

        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">Strength Building Week</h2>
                <p className="text-sm text-gray-600">Build core strength with warrior poses and planks</p>
                <div className="mt-2 flex items-center space-x-2">
                    <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Intermediate</span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        6/7 days
                    </span>
                </div>
            </div>

            <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">85.71%</div>
                <p className="text-sm text-gray-500">Complete</p>
            </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 mb-6">
            <div className="bg-blue-900 h-2.5 rounded-full" style={{ width: "85.71%" }}></div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Daily Instructions</h3>
        <ul className="space-y-3">
            <li className="flex items-start bg-blue-50 rounded-md p-3">
                <div className="bg-sky-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</div>
                <span>Begin with 10 minutes of dynamic warm-up</span>
            </li>
            <li className="flex items-start bg-blue-50 rounded-md p-3">
                <div className="bg-sky-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</div>
                <span>Practice warrior poses for 15 minutes</span>
            </li>
            <li className="flex items-start bg-blue-50 rounded-md p-3">
                <div className="bg-sky-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</div>
                <span>Hold plank variations for 2–3 minutes total</span>
            </li>
            <li className="flex items-start bg-blue-50 rounded-md p-3">
                <div className="bg-sky-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</div>
                <span>Cool down with gentle stretches</span>
            </li>
        </ul>

        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md p-4 mt-6">
            <p className="font-semibold flex items-center gap-2">
                <svg class="w-[25px] h-[25px] fill-[#eab308]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"></path>
                </svg>
                Challenge Reward
            </p>
            <p>Strength Warrior Badge</p>
        </div>

        <div className="flex  justify-between gap-3 mt-6">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white flex-1">
                <svg class="w-[20px] h-[20px] fill-[#ffff]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"></path>
                </svg>Mark Today as Complete
            </button>
            <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-6 rounded-md w-full sm:w-auto flex items-center gap-2">
                ▶️ Start Practice
            </button>
        </div>
    </div>
);

export default DailyClick;