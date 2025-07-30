import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaFire } from "react-icons/fa";
import { LuCircleCheckBig } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";



const Attendance = () => {
    return(
        <div>
            <div className='flex justify-center flex-col items-center mt-14 mb-8 p-5'>
                <h1 className='text-4xl font-bold text-sky-500'>Attendance Tracker</h1>
                <p className='text-[#747373] '>Track your yoga practice consistency</p>
            </div>
            <div className=' flex gap-6 px-32 justify-center items-center'>
                <div className=' w-1/4 flex flex-col justify-center items-center py-6 border rounded-md border-sky-200 bg-red-50'>
                    <FaFire className='text-3xl text-red-600' />
                    <h1 className='text-2xl font-bold text-sky-500 mt-4'>12</h1>
                    <p className='text-gray-600 text-sm'>Day Streak</p>
                </div>
                <div className=' w-1/4 flex flex-col justify-center items-center py-6 border rounded-md border-sky-200 bg-green-50'>
                    <LuCircleCheckBig className='text-3xl text-green-500' />
                    <h1 className='text-2xl font-bold text-sky-500 mt-4'>45</h1>
                    <p className='text-gray-600 text-sm'>Total Sessions</p>
                </div>
                <div className=' w-1/4 flex flex-col justify-center items-center py-6 border rounded-md border-sky-200 bg-blue-50 '>
                    <IoCalendarClearOutline className='text-3xl text-blue-500' />
                    <h1 className='text-2xl font-bold text-sky-500 mt-4'>15/20</h1>
                    <p className='text-gray-600 text-sm'>Monthy Goal</p>
                </div>
                <div className=' w-1/4 flex flex-col justify-center items-center py-6 border rounded-md border-sky-200 bg-purple-50'>
                    <FaRegClock className='text-3xl text-purple-500' />
                    <h1 className='text-2xl font-bold text-sky-500 mt-4'>6:30 AM</h1>
                    <p className='text-gray-600 text-sm'>Avg. Practice Time</p>
                </div>
            </div>
            
            <div className=' flex justify-center items-center gap-10 px-56 p-5'>
                <div className='w-1/2 border border-sky-200 rounded-lg flex flex-col justify-center p-5'>
                    <h1 className='flex items-start text-sky-500 gap-2 font-bold text-xl '><IoCalendarClearOutline className='mt-1'/>Practice Calender</h1>
                    <Calendar className='w-full mt-4 text-sky-700 rounded-lg'/>
                    <button className='border rounded-lg mt-5 bg-sky-500 text-white py-3 hover:bg-sky-700'>Mark Today's Practice</button>
                </div>
                <div className=' w-1/2 border border-sky-200 rounded-lg flex flex-col justify-center p-5 gap-4'>
                    <h1 className='text-sky-500 font-bold text-xl'>Progress & Goals</h1>
                    <div className='flex justify-between'>
                        <p className='justify-start text-sm text-gray-700'>Monthly Goal</p>
                        <p className='justify-end text-sm text-sky-700'>15/20 days</p>
                    </div>
                    <div className='border rounded-lg border-orange-100 bg-orange-100 p-3  flex gap-4'>
                        <FaFire className='text-2xl text-red-600 mt-2' />
                        <div>
                            <h1 className='text-sm font-bold text-amber-700'>12 Days Streak!</h1>
                            <p className='text-orange-500 text-sm'>Keep it up! You're doing great.</p>
                        </div>
                    </div>
                    <button className='border rounded-lg border-sky-400 py-2 text-sky-700'>Set New Goal</button>
                    <button className='border rounded-lg border-sky-400 py-2 text-sky-700'>View Practice History</button>
                </div>
            </div>


        </div>
    )
}

export default Attendance;