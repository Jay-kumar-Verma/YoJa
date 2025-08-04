import React, { useState } from "react";

export default function Mantras() {
  const mantras = [
    {
      title: "Om Namah Shivaya",
      desc: "A powerful mantra for inner peace and spiritual awakening",
      duration: "5:30",
      category: "Traditional",
      img: "https://via.placeholder.com/40",
    },
    {
      title: "So Hum Meditation",
      desc: "Connect with your inner self through breath awareness",
      duration: "10:00",
      category: "Meditation",
      img: "https://via.placeholder.com/40",
    },
    {
      title: "Gayatri Mantra",
      desc: "Ancient Sanskrit mantra for wisdom and enlightenment",
      duration: "7:45",
      category: "Sacred Chants",
      img: "https://via.placeholder.com/40",
    },
    {
      title: "Ocean Waves & OM",
      desc: "Calming ocean sounds combined with sacred OM chanting",
      duration: "15:00",
      category: "Nature Sounds",
      img: "https://via.placeholder.com/40",
    },
  ];

  const initialAffirmations = [
    "I am strong, flexible, and balanced",
    "My body is my temple, and I treat it with love",
    "I breathe in peace and exhale stress",
    "Every day I grow stronger in mind and body",
    "I am grateful for my body's abilities",
    "I choose to live in harmony with myself",
  ];

  const [affirmations, setAffirmations] = useState(initialAffirmations);

  const generateNew = () => {
    const newAffirmation = "I embrace calm and radiate positivity 🌟";
    setAffirmations((prev) => [...prev.slice(1), newAffirmation]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 text-gray-800 px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-sky-600 mb-2">
        Yoga Mantras & Positive Vibes
      </h1>
      <p className="text-center text-gray-600 text-base mb-10">
        Find your inner peace through sacred sounds and affirmations
      </p>

      {/* Top: Mantras and Affirmations */}
      <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Mantra List */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-lg font-bold text-sky-600 mb-4">
            🎵 Sacred Mantras & Chants
          </h2>
          <div className="space-y-3">
            {mantras.map((m, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 bg-white hover:bg-gray-50 p-3 rounded-md border"
              >
                <div className="flex gap-3">
                  <img
                    src={m.img}
                    alt={m.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{m.title}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {m.category} • {m.duration}
                    </p>
                  </div>
                </div>
                <button className="text-sky-500 hover:text-sky-700 text-lg mt-1">
                  ▶
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Affirmations */}
        <div className="bg-purple-50 rounded-xl shadow-md p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-purple-600 mb-4">
              Daily Affirmations
            </h2>
            <ul className="space-y-2 mb-4">
              {affirmations.map((text, idx) => (
                <li
                  key={idx}
                  className="bg-white rounded-md py-2 px-4 text-sm italic shadow"
                >
                  "{text}"
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={generateNew}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition"
          >
            Generate New Affirmation
          </button>
        </div>
      </div>

      {/* Bottom Right: Guided Breathing */}
      <div className="max-w-7xl mx-auto mt-6 flex justify-end">
        <div className="bg-green-50 rounded-xl shadow-md p-5 w-full md:w-1/2 lg:w-1/3">
          <h2 className="text-lg font-bold text-green-600 mb-4">
            Guided Breathing
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 bg-green-400 rounded-full animate-pulse"></div>
            <p className="font-medium text-md">4-7-8 Breathing Technique</p>
            <p className="text-sm text-gray-600 text-center">
              Inhale for 4 counts, hold for 7, exhale for 8
            </p>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 w-full rounded-md transition">
            Start Breathing Exercise
          </button>
        </div>
      </div>
    </div>
  );
}
