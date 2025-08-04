import React, { useState } from "react";
import Webcam from "react-webcam";

function RecordAsana() {
  const poses = [
    { name: "Warrior I", level: "Beginner" },
    { name: "Downward Dog", level: "Beginner" },
    { name: "Tree Pose", level: "Intermediate" },
    { name: "Warrior III", level: "Advanced" },
  ];

  const [selectedPose, setSelectedPose] = useState("Warrior I");
  const [cameraOn, setCameraOn] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 360,
    facingMode: "user",
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white py-10 px-4 flex justify-center">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-1">Record Your Asana</h1>
        <p className="text-center text-gray-600 mb-8">Get real-time AI feedback on your yoga poses</p>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Pose Selector */}
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Select Pose</h2>
            {poses.map((pose, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPose(pose.name)}
                className={`w-full mb-2 px-4 py-2 rounded border border-blue-300 text-left flex justify-between items-center transition
                  ${
                    selectedPose === pose.name
                      ? "bg-blue-600 text-white font-semibold"
                      : "hover:bg-blue-100"
                  }`}
              >
                {pose.name}
                <span className="text-sm text-gray-500">{pose.level}</span>
              </button>
            ))}
          </div>

          {/* Camera Section */}
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Live Camera</h2>

            <div className="rounded-lg overflow-hidden mb-4 bg-gray-900 flex items-center justify-center h-[360px]">
              {cameraOn ? (
                <Webcam
                  audio={false}
                  height={360}
                  width={640}
                  videoConstraints={videoConstraints}
                  className="rounded-lg w-full h-full object-cover"
                />
              ) : (
                <div className="text-white text-center">
                  <p className="text-3xl mb-2">Camera</p>
                  <p>Click start to begin pose analysis</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setCameraOn((prev) => !prev)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded w-full"
            >
              {cameraOn ? "⏹ Stop Recording" : "▶ Start Recording"}
            </button>

            <p className="mt-4 text-sm text-gray-600 text-center">
              Selected Pose: <strong>{selectedPose}</strong>
            </p>
          </div>
        </div>

        {/* AI Feedback Section */}
        <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-1">AI Feedback</h3>
          <p>
            Great alignment! Try to straighten your back leg a bit more for perfect form.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-900">
          <h3 className="font-semibold mb-2">How it works</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Select your desired pose from the list</li>
            <li>Click "Start Recording" to activate your camera</li>
            <li>Position yourself in the camera frame</li>
            <li>Hold your pose for 3–5 seconds for analysis</li>
            <li>Receive real-time feedback on your alignment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RecordAsana;
