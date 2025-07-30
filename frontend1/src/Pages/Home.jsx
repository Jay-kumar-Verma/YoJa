import React from 'react';
import { FiCheckCircle } from "react-icons/fi";
import { BsFileBarGraph } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import heroImage from '../assets/hero.jpeg'; 
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      
      <div
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
            Home For Online <span className="text-sky-500">Yoga</span>
          </h1>
          <p className="text-white text-lg md:text-xl mb-8">
            Transform your practice with AI-powered posture correction <br className="hidden md:block" />
            and real-time feedback through your webcam.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link to="/login">
              <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-2xl transition-transform transform hover:scale-105 shadow-lg">
                Start Your Free Trial →
              </button>
            </Link>

            <Link to="/demo">
              <button className="bg-white text-sky-500 hover:bg-sky-600 hover:text-white font-semibold px-6 py-3 border border-sky-500 rounded-2xl transition-transform transform hover:scale-105 shadow-lg">
                Watch Demo
              </button>
            </Link>
          </div>
        </div>
      </div>


      <section className="flex flex-col md:flex-row items-center justify-between gap-12 px-6 md:px-16 py-20">
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Improve Your <span className="text-sky-500">Alignment</span>
          </h2>
          <p className="text-gray-600 mb-4">
            Our advanced AI uses computer vision to analyze your posture in real-time, giving instant feedback to perfect your yoga practice.
          </p>
          <h3 className="text-xl text-sky-500 font-semibold">200+ Happy Customers</h3>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://burst.shopifycdn.com/photos/macbook-air-on-desk.jpg?width=1000&format=pjpg&exif=0&iptc=0"
            alt="Computer Yoga"
            className="rounded-xl shadow-md w-full transform transition-transform duration-300 hover:scale-105"
          />
        </div>
      </section>

    
      <section className="text-center px-6 md:px-16 py-20 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          What is <span className="text-sky-500">YoJa?</span>
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-4xl mx-auto mb-10">
          YoJa blends ancient yoga wisdom with AI. Using CNNs and OpenCV, we track your movements live via webcam to help you achieve perfect alignment and deepen your practice.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "CNN Technology", desc: "Advanced neural networks for precise pose detection" },
            { title: "OpenCV Integration", desc: "Real-time computer vision for movement analysis" },
            { title: "Instant Feedback", desc: "Get corrections and improvements in real-time" }
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <FiCheckCircle className="text-sky-500 text-4xl mx-auto mb-4 transition duration-300 hover:rotate-6" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="text-center px-6 md:px-16 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why Choose <span className="text-sky-500">YoJa?</span>
        </h2>
        <p className="text-gray-600 text-base md:text-lg mb-12 max-w-3xl mx-auto">
          Experience the future of yoga with AI-powered enhancements to your practice.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature icon={<FiCheckCircle />} title="Real-Time Posture Tracking" desc="Instant feedback on alignment & posture corrections." />
          <Feature icon={<BsFileBarGraph />} title="Detailed Analytics" desc="Track your progress with insights and reports." />
          <Feature icon={<FaRegHeart />} title="Personalized Coaching" desc="Custom guidance based on skill level and goals." />
        </div>
      </section>


      <section className="bg-gray-50 px-6 md:px-16 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          What Our <span className="text-sky-500">Users</span> Say
        </h2>
        <p className="text-center text-gray-600 mb-12">Join thousands of yogis transforming their practice.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Yoga Enthusiast",
              feedback: "YoJa has completely transformed my yoga practice. The real-time feedback helps me improve instantly!"
            },
            {
              name: "Michael Chen",
              role: "Beginner Yogi",
              feedback: "As a beginner, YoJa's AI guidance has been invaluable. I feel more confident every day."
            },
            {
              name: "Emma Rodriguez",
              role: "Advanced Practitioner",
              feedback: "The personalized coaching is amazing. It's like having a personal instructor available 24/7."
            }
          ].map((user, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md text-left transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              <p className="italic text-gray-700 mb-4">"{user.feedback}"</p>
              <h4 className="font-semibold">{user.name}</h4>
              <p className="text-sky-500 text-sm">{user.role}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="text-center py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay <span className="text-sky-500">Updated</span>
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Get the latest yoga tips, AI insights, and platform updates delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-80 px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
          />
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full transition-transform transform hover:scale-105 shadow-md">
            Subscribe
          </button>
        </div>
      </section>
    </>
  );
};


const Feature = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
    <div className="text-4xl text-sky-500 mb-3 transition duration-300 hover:rotate-6">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default Home;
