import React from "react";

const Cal_Count = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-8">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-2">
                Daily Calorie Counter
            </h1>
            <p className="text-center text-gray-500 mb-8">
                Track your nutrition and maintain a healthy lifestyle
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <svg class="w-[50px] h-[50px] fill-[#fb923c]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"></path>
                    </svg>
                    <div className="text-2xl font-bold text-blue-900">1450/2000</div>
                    <div className="text-gray-500">Calories</div>
                    <div className="w-full h-2 bg-gray-100 rounded mt-4">
                        <div className="h-2 bg-orange-400 rounded" style={{ width: "72%" }}></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <svg class="w-[50px] h-[50px] fill-[#60a5fa]" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"></path>
                    </svg>
                    <div className="text-2xl font-bold text-blue-900">6/8</div>
                    <div className="text-gray-500">Glasses of Water</div>
                    <div className="w-full h-2 bg-gray-100 rounded mt-4">
                        <div className="h-2 bg-blue-400 rounded" style={{ width: "75%" }}></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <div className="text-3xl text-green-400 mb-2"><svg class="w-[50px] h-[50px] fill-[#4ade80]" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M416 0C352.3 0 256 32 256 32V160c48 0 76 16 104 32s56 32 104 32c56.4 0 176-16 176-96S512 0 416 0zM128 96c0 35.3 28.7 64 64 64h32V32H192c-35.3 0-64 28.7-64 64zM288 512c96 0 224-48 224-128s-119.6-96-176-96c-48 0-76 16-104 32s-56 32-104 32V480s96.3 32 160 32zM0 416c0 35.3 28.7 64 64 64H96V352H64c-35.3 0-64 28.7-64 64z"></path>
                    </svg></div>
                    <div className="text-2xl font-bold text-blue-900">8,500</div>
                    <div className="text-gray-500">Steps Today</div>
                    <div className="w-full h-2 bg-gray-100 rounded mt-4">
                        <div className="h-2 bg-green-400 rounded" style={{ width: "85%" }}></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <svg class="w-[50px] h-[50px] fill-[#c084fc]" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M384 32H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H398.4c-5.2 25.8-22.9 47.1-46.4 57.3V448H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H320 128c-17.7 0-32-14.3-32-32s14.3-32 32-32H288V153.3c-23.5-10.3-41.2-31.6-46.4-57.3H128c-17.7 0-32-14.3-32-32s14.3-32 32-32H256c14.6-19.4 37.8-32 64-32s49.4 12.6 64 32zm55.6 288H584.4L512 195.8 439.6 320zM512 416c-62.9 0-115.2-34-126-78.9c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C627.2 382 574.9 416 512 416zM126.8 195.8L54.4 320H199.3L126.8 195.8zM.9 337.1c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C242 382 189.7 416 126.8 416S11.7 382 .9 337.1z"></path>
                    </svg>
                    <div className="text-2xl font-bold text-blue-900">65</div>
                    <div className="text-gray-500">kg</div>
                    <div className="text-green-500 text-sm mt-2">-0.5kg this week</div>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <svg class="w-[25px] h-[25px] fill-[#1e3a8a]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"></path>
                    </svg>
                            <h2 className="text-xl font-bold text-blue-900">Today's Meals</h2>
                        </div>
                        <div className="space-y-4">

                            <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-start">
                                <div>
                                    <div className="font-semibold text-blue-900">Breakfast</div>
                                    <div className="text-sm text-gray-500">8:00 AM</div>
                                    <div className="flex gap-2 mt-2">
                                        <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">Oatmeal</span>
                                        <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">Banana</span>
                                        <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">Almonds</span>
                                    </div>
                                </div>
                                <div className="font-bold text-blue-900 text-lg">350 cal</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-start">
                                <div>
                                    <div className="font-semibold text-blue-900">Lunch</div>
                                    <div className="text-sm text-gray-500">1:00 PM</div>
                                    <div className="flex gap-2 mt-2">
                                        <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">Quinoa Bowl</span>
                                        <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">Grilled Chicken</span>
                                        <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">Vegetables</span>
                                    </div>
                                </div>
                                <div className="font-bold text-blue-900 text-lg">550 cal</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-start">
                                <div>
                                    <div className="font-semibold text-blue-900">Snack</div>
                                    <div className="text-sm text-gray-500">4:00 PM</div>
                                    <div className="flex gap-2 mt-2">
                                        <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">Greek Yogurt</span>
                                        <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">Berries</span>
                                    </div>
                                </div>
                                <div className="font-bold text-blue-900 text-lg">150 cal</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-start">
                                <div>
                                    <div className="font-semibold text-blue-900">Dinner</div>
                                    <div className="text-sm text-gray-500">7:30 PM</div>
                                    <div className="flex gap-2 mt-2">
                                        <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">Salmon</span>
                                        <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">Sweet Potato</span>
                                        <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">Broccoli</span>
                                    </div>
                                </div>
                                <div className="font-bold text-blue-900 text-lg">400 cal</div>
                            </div>
                        </div>
                        <button className="w-full mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg transition">
                            Add New Meal
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow p-6 mb-6">
                        <h2 className="text-xl font-bold text-blue-900 mb-4">Quick Log</h2>
                        <form className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-gray-700 mb-1 text-sm">Water (glasses)</label>
                                    <input type="number" min="0" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" defaultValue={0} />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700 mb-1 text-sm">Weight (kg)</label>
                                    <input type="number" min="0" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" defaultValue={0} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg transition">
                                Update
                            </button>
                        </form>
                    </div>
                    <div className="bg-green-50 rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold text-green-700 mb-3">Nutrition Tips</h2>
                        <ul className="list-disc pl-5 text-green-700 space-y-2">
                            <li>Drink water before meals to aid digestion</li>
                            <li>Include protein in every meal for sustained energy</li>
                            <li>Eat colorful vegetables for diverse nutrients</li>
                            <li>Practice mindful eating during yoga sessions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Cal_Count;