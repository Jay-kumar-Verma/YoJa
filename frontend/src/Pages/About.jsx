import { FaBullseye, FaHeart, FaGlobe, FaLightbulb, FaMedal } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-white min-h-screen">


      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About <span className="text-sky-500">YoJa</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We're on a mission to democratize quality yoga instruction through cutting-edge AI, making personalized guidance accessible worldwide.
        </p>
      </div>


      <div className="bg-sky-50 py-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1399&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Yoga"
              className="rounded-2xl shadow-lg w-full object-cover transform transition duration-300 hover:scale-105"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At YoJa, we blend traditional yoga with AI. Our mission is to help everyone improve posture, flexibility, and peace of mind—safely and smartly.
            </p>
            <p className="text-gray-700 mb-6">
              We believe yoga should be accessible to everyone. With AI guidance, we deliver personalized instruction anytime, anywhere.
            </p>
            <div className="flex items-center gap-4">
              <FaHeart className="text-sky-500 text-3xl transform transition duration-300 hover:scale-110" />
              <span className="text-xl font-semibold text-sky-600">Wellness for Everyone</span>
            </div>
          </div>
        </div>
      </div>

    
      <div className="bg-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Our AI stack delivers real-time posture feedback, pose correction, and insightful analytics—all through your webcam.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "CNN-Powered Detection",
                description: "We use convolutional neural networks to identify and analyze your poses live, ensuring safety and effectiveness.",
                icon: <FaBullseye className="text-sky-500 text-4xl" />
              },
              {
                title: "Webcam Tracking",
                description: "OpenCV enables us to track your movement using just a webcam—no need for wearables.",
                icon: <FaGlobe className="text-sky-500 text-4xl" />
              },
              {
                title: "Real-Time Feedback",
                description: "Get instant guidance and detailed performance metrics with every session.",
                icon: <FaLightbulb className="text-sky-500 text-4xl" />
              }
            ].map(({ title, description, icon }, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="mb-4 transform transition duration-300 hover:rotate-6">{icon}</div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    
      <div className="bg-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-10">Why Choose YoJa?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Personalized Sessions",
                description: "Yoga routines tailored to your skill level and goals.",
                icon: <FaBullseye className="text-sky-500 text-3xl" />
              },
              {
                title: "Progress Insights",
                description: "Track your improvement with advanced analytics.",
                icon: <FaMedal className="text-sky-500 text-3xl" />
              },
              {
                title: "Community Challenges",
                description: "Join our tribe and participate in global yoga events.",
                icon: <FaHeart className="text-sky-500 text-3xl" />
              }
            ].map(({ title, description, icon }, i) => (
              <div
                key={i}
                className="flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-md"
              >
                <div className="bg-blue-100 p-5 rounded-full mb-4 transition duration-300 hover:bg-blue-200 hover:rotate-6">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold mb-1">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <button className="bg-sky-500 hover:bg-sky-600 text-white py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg hover:shadow-xl">
              Start Your Journey Today
            </button>
          </div>
        </div>
      </div>

     
      <div className="bg-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { name: "Aarti Sharma", role: "Founder & CEO", initials: "AS" },
              { name: "Raj Kumar", role: "AI Developer", initials: "RK" },
              { name: "Priya Mehta", role: "Yoga Instructor", initials: "PM" },
              { name: "Vikram Singh", role: "Product Designer", initials: "VS" },
            ].map(({ name, role, initials }, i) => (
              <div
                key={i}
                className="flex flex-col items-center transform transition duration-300 hover:scale-105"
              >
                <div className="bg-gradient-to-br from-sky-400 to-blue-500 text-white h-28 w-28 flex items-center justify-center rounded-full text-3xl font-bold mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {initials}
                </div>
                <h3 className="text-lg font-bold">{name}</h3>
                <p className="text-gray-600">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
