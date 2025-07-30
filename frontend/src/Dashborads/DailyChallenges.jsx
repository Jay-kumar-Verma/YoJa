import React from "react";
import { Link } from "react-router-dom";

const DailyChallenges = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-8">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-1">
                Daily Challenges
            </h1>
            <p className="text-center text-gray-500 mb-8">
                Push your limits and achieve your yoga goals
            </p>


            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-4 text-sky-600 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-7 w-7">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-medium text-sky-600">Active Challenges</h2>
                </div>
                <div className="space-y-4 mb-8">

                    <div className="bg-white rounded-xl shadow border border-blue-100 p-5 flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-blue-900 text-lg">30-Day Flexibility Challenge</div>
                                    <div className="text-gray-600 text-sm mb-1">Improve your flexibility with daily stretching routines</div>
                                </div>
                                <div className="text-blue-700 font-bold text-lg text-right">75%<span className="block text-xs font-normal text-gray-500">Complete</span></div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 mb-1">
                                <span className="text-gray-500 text-xs">23/30 days</span>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-2xl">Beginner</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded mb-2">
                                <div className="h-2 bg-blue-900 rounded" style={{ width: "75%" }}></div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <svg class="w-[25px] h-[25px] fill-[#eab308]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"></path>
                                </svg>
                                <span>Reward: Flexibility Master Badge</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                            <Link to= "/dailyclick">
                             <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2 rounded transition">
                                Continue Challenge
                            </button>
                            </Link>
                           
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow border border-blue-100 p-5 flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-blue-900 text-lg">Strength Building Week</div>
                                    <div className="text-gray-600 text-sm mb-1">Build core strength with warrior poses and planks</div>
                                </div>
                                <div className="text-blue-700 font-bold text-lg text-right">45%<span className="block text-xs font-normal text-gray-500">Complete</span></div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 mb-1">
                                <span className="text-gray-500 text-xs">3/7 days</span>
                                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-2xl">Intermediate</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded mb-2">
                                <div className="h-2 bg-blue-900 rounded" style={{ width: "45%" }}></div>
                            </div>
                            <div className="flex items-center gap-2  text-sm">
                                <svg class="w-[25px] h-[25px] fill-[#eab308]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"></path>
                                </svg>
                                <span>Reward: Strength Warrior Badge</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                            <Link to= "/dailyclick">
                             <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2 rounded transition">
                                Continue Challenge
                            </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>


            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600 text-xl"><svg class="w-[30px] h-[30px] fill-[#16a34a]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"></path>
                                </svg></span>
                    <h2 className="text-lg font-bold text-green-700">Completed Challenges</h2>
                </div>
                <div className="bg-green-50 rounded-xl border border-green-100 shadow p-5 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <div className="font-semibold text-green-900">Mindfulness Journey</div>
                        <div className="text-green-700 text-sm">Completed 14/14 days</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <span className="bg-green-300 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">Zen Master Badge</span>
                        <svg class="w-[25px] h-[25px] fill-[#eab308]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"></path>
                                </svg>
                    </div>
                </div>
            </div>


            <div className="border border-gray-200 p-8 rounded-xl">
                <h2 className="text-lg font-bold text-blue-700 mb-3">Discover New Challenges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-blue-100 shadow p-5 flex flex-col justify-between hover:bg-blue-50">
                        <div >
                            <div className="font-semibold text-blue-900 mb-1">Balance Master</div>
                            <div className="text-gray-600 text-sm mb-4">14-day balance improvement program</div>
                        </div>
                        <button className=" hover:bg-sky-700 hover:text-white text-sky-600 font-semibold px-4 py-2 rounded-md transition w-fit border border-sky-600">
                            Start Challenge
                        </button>
                    </div>
                    <div className="bg-white rounded-xl border border-blue-100 shadow p-5 flex flex-col justify-between hover:bg-blue-50">
                        <div>
                            <div className="font-semibold text-blue-900 mb-1">Advanced Flow</div>
                            <div className="text-gray-600 text-sm mb-4">21-day advanced pose sequences</div>
                        </div>
                        <button className=" hover:bg-sky-700 hover:text-white text-sky-600 font-semibold px-4 py-2 rounded-md transition w-fit border border-sky-600">
                            Start Challenge
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default DailyChallenges;