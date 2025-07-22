import React from 'react';
import { GiPineTree, GiSandSnake, GiCamel } from "react-icons/gi";
import { FaMountainSun, FaDog } from "react-icons/fa6";
import { PiFlowerLotus } from "react-icons/pi";
import { LuTriangleRight, LuBaby } from "react-icons/lu";
import { Link } from 'react-router-dom';

const Asanas = () => {
  const asanaData = [
    {
      icon: <FaMountainSun className='h-14 w-1/2 mb-3 text-sky-500 transition-transform hover:rotate-6' />,
      name: 'Tadasana',
      sub: 'Mountain Pose',
      level: 'Beginner',
      levelColor: 'green',
      duration: '1-3 mins',
      benefits: 'Improve posture, balance, and focus',
      desc: 'A foundational standing pose that builds strength and awareness throughout the body.'
    },
    {
      icon: <GiPineTree className='h-14 w-1/2 mb-3 text-sky-500 transition-transform hover:rotate-6' />,
      name: 'Vrikshasana',
      sub: 'Tree Pose',
      level: 'Beginner',
      levelColor: 'green',
      duration: '30s-1mins',
      benefits: 'Enhances balance, concentration, and leg strength',
      desc: 'A balancing pose that cultivates focus and stability while strengthening the legs.'
    },
    {
      icon: <GiSandSnake className='h-14 w-1/2 mb-3 text-sky-500 transition-transform hover:rotate-6' />,
      name: 'Bhujangasana',
      sub: 'Cobra Pose',
      level: 'Beginner',
      levelColor: 'green',
      duration: '15-30s',
      benefits: 'Strengthens back, opens chest, improves spinal flexibility',
      desc: 'A gentle backbend that strengthens the spine and opens the heart center.'
    },
    {
      icon: <FaDog className='h-14 w-1/2 mb-3 text-sky-500 transition-transform hover:rotate-6' />,
      name: 'Adho Mukha Svanasana',
      sub: 'Downward Dog',
      level: 'Beginner',
      levelColor: 'green',
      duration: '1-3 mins',
      benefits: 'Full body stretch, strengthens arms and legs',
      desc: 'An energizing pose that stretches and strengthens the entire body.'
    },
    {
      icon: <PiFlowerLotus className='h-14 w-1/2 mb-3 text-sky-500 transition-transform hover:rotate-6' />,
      name: 'Padmasana',
      sub: 'Lotus Pose',
      level: 'Advanced',
      levelColor: 'red',
      duration: '5-15 mins',
      benefits: 'Calms mind, improves hip flexibility, aids meditation',
      desc: 'A seated meditation pose that promotes tranquility and inner awareness.'
    },
    {
      icon: <LuTriangleRight className='h-14 w-1/2 mb-3 text-sky-500 transition-transform hover:rotate-6' />,
      name: 'Utthita Trikonasana',
      sub: 'Extended Triangle Pose',
      level: 'Intermediate',
      levelColor: 'orange',
      duration: '30s-1min',
      benefits: 'Strengthens legs, stretches hips, improves balance',
      desc: 'A standing pose that creates length throughout the side body.'
    },
    {
      icon: <LuBaby className='h-14 w-1/2 mb-3 text-sky-500 transition-transform hover:rotate-6' />,
      name: 'Balasana',
      sub: "Child's Pose",
      level: 'Beginner',
      levelColor: 'green',
      duration: '1-5 mins',
      benefits: 'Relaxes mind, stretches hips and thighs, relieves stress',
      desc: 'A restorative pose that provides comfort and introspection.'
    },
    {
      icon: <GiCamel className='h-14 w-1/2 mb-3 text-sky-500 transition-transform hover:rotate-6' />,
      name: 'Ustrasana',
      sub: 'Camel Pose',
      level: 'Intermediate',
      levelColor: 'orange',
      duration: '30s-1min',
      benefits: 'Opens chest and hip flexors, strengthens back',
      desc: 'An energizing backbend that opens the heart and improves spinal flexibility.'
    }
  ];

  const getLevelColor = (level) => {
    const colorMap = {
      Beginner: 'green',
      Intermediate: 'orange',
      Advanced: 'red'
    };
    return `text-${colorMap[level.toLowerCase()]}-600 bg-${colorMap[level.toLowerCase()]}-50 hover:text-${colorMap[level.toLowerCase()]}-800`;
  };

  return (
    <div>
      {/* Hero */}
      <div className='flex flex-col justify-center items-center text-center h-96'>
        <h1 className='text-4xl md:text-6xl font-bold'>Explore <span className='text-sky-500'>Asanas</span> with YoJa</h1>
        <p className='text-base sm:text-[20px] md:text-[22px] leading-8 pt-3 px-3 text-[#747373] w-full'>
          Discover yoga poses with AI-powered guidance for perfect alignment and posture correction.
        </p>
      </div>

      {/* Filters */}
      <div className='flex flex-col md:flex-row gap-4 justify-center items-center py-10'>
        {['All Poses', 'Beginner', 'Intermediate', 'Advanced'].map((label, idx) => (
          <button key={idx} className='border border-sky-100 rounded-full shadow-[2px_2px_15px_rgba(2,132,199,0.2)] px-4 py-2 text-sky-500 hover:text-sky-800 transition'>
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className='px-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
        {asanaData.map((asana, i) => (
          <div
            key={i}
            className='flex flex-col justify-center items-center p-4 border border-sky-100 rounded-lg shadow-[2px_2px_30px_rgba(2,132,199,0.2)] transform transition-transform duration-300 hover:scale-105'
          >
            <div className='text-center my-4 p-4'>
              <h1 className='font-semibold text-lg flex flex-col justify-center items-center'>{asana.icon}{asana.name}</h1>
              <p className='text-[#747373] font-light text-sm my-2'>{asana.sub}</p>
              <button className={`border border-sky-100 rounded-full px-2 py-1 text-xs shadow ${getLevelColor(asana.level)}`}>
                {asana.level}
              </button>
            </div>
            <div className='text-[#747373] text-sm p-4'>
              <p>{asana.duration}</p>
              <p className='my-2'>{asana.benefits}</p>
              <p className='mt-5'>{asana.desc}</p>
            </div>
            <button className='bg-sky-500 mt-4 border rounded-3xl py-3 w-3/4 font-semibold text-white mb-5 hover:bg-sky-600 transition'>
              Try Now with AI
            </button>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className='h-96 flex flex-col justify-center items-center text-center mt-10'>
        <h1 className='text-3xl md:text-5xl font-bold'>Ready to Perfect Your Practice?</h1>
        <p className='text-base sm:text-[20px] md:text-[22px] leading-8 pt-3 px-3 text-[#747373] w-full'>
          Start your AI-guided yoga journey today and experience real-time posture correction.
        </p>
        <div className='flex flex-col md:flex-row justify-center items-center gap-6 my-7'>
          <Link to="/login" className='bg-sky-500 rounded-3xl py-3 px-6 font-semibold text-white hover:bg-sky-600 transition'>
            Start Free Trial
          </Link>
          <Link to="/demo" className='border border-sky-500 rounded-3xl py-3 px-6 font-semibold text-sky-500 hover:bg-sky-500 hover:text-white transition'>
            Watch Demo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Asanas;
