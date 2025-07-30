import React from "react";
import Mountain from "../assets/mountainPose.jpg";
import Downward from "../assets/downwardDog.jpg";
import Warrior from "../assets/Warrior-1-Pose.jpeg";

const asanas = [
  {
    img: Mountain,
    title: "Mountain Pose",
    subtitle: "Tadasana",
    level: "Beginner",
    duration: "30s - 1min",
    benefits: ["Improves posture", "Strengthens thighs", "Reduces flat feet"],
  },
  {
    img: Downward,
    title: "Downward Dog Pose",
    subtitle: "Adho Mukha Svanasana",
    level: "Beginner",
    duration: "1 - 3 min",
    benefits: ["Stretches hamstrings", "Strengthens arms", "Energizes body"],
  },
  {
    img: Warrior,
    title: "Warrior I Pose",
    subtitle: "Virabhadrasana I",
    level: "Beginner",
    duration: "30s - 1min",
    benefits: ["Strengthens legs", "Opens hips", "Improves balance"],
  },
  {
    img: Mountain,
    title: "Tree Pose",
    subtitle: "Vrikshasana",
    level: "Intermediate",
    duration: "30s - 1min",
    benefits: ["Improves balance", "Strengthens legs", "Enhances focus"],
  },
  {
    img: Downward,
    title: "Warrior III Pose",
    subtitle: "Virabhadrasana III",
    level: "Advanced",
    duration: "30s - 1min",
    benefits: ["Improves balance", "Strengthens core", "Enhances focus"],
  },
  {
    img: Warrior,
    title: "Crow Pose",
    subtitle: "Bakasana",
    level: "Advanced",
    duration: "10 - 30s",
    benefits: ["Strengthens arms", "Improves balance", "Builds confidence"],
  },
];

const levelStyles = {
  Beginner: "text-green-600 bg-green-100",
  Intermediate: "text-orange-500 bg-orange-100",
  Advanced: "text-red-500 bg-red-100",
};

const Asanass = () => {
  return (
    <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-sky-600 mb-2">Yoga Asanas</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Explore our comprehensive collection of yoga poses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {asanas.map((asana, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-sky-200 overflow-hidden relative"
          >
            <img src={asana.img} alt={asana.title} className="w-full h-56 object-cover" />

            <div
              className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full border ${levelStyles[asana.level]}`}
            >
              {asana.level}
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold text-sky-600">{asana.title}</h2>
              <p className="italic text-sm text-gray-500">{asana.subtitle}</p>
              <p className="text-sm text-sky-500 my-1">{asana.duration}</p>

              <h3 className="text-gray-800 font-medium mt-3 mb-1">Benefits:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {asana.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Asanass;
