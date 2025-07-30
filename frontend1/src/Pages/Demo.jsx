import React from 'react';
import { Link } from 'react-router-dom';

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            How <span className="text-sky-500">YoJa</span> Works
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            See how AI-powered posture correction transforms your yoga practice in real-time.
          </p>
        </div>
      </section>


<section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
  <div className="max-w-5xl mx-auto">
    <div className="rounded-xl overflow-hidden shadow-2xl">
      <div className="relative aspect-video w-full">
        <iframe
          className="w-full h-full rounded-xl"
          src="https://www.youtube.com/embed/v7AYKMP6rOE"
          title="Beginner Yoga with Adriene"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>

    <div className="text-center mt-8">
      <Link to="/get-started">
        <button className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8 py-3 text-lg transition">
          Start Your Free Trial
        </button>
      </Link>
    </div>
  </div>
</section>

      {/* How It Works Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Three Simple Steps</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started with AI-powered yoga is easier than you think
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white shadow-lg rounded-xl p-8 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                📷
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Turn on Webcam</h3>
              <p className="text-gray-600">
                Allow camera access for real-time pose detection. Your privacy is protected—data stays on your device.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white shadow-lg rounded-xl p-8 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 2: Follow Guided Asanas</h3>
              <p className="text-gray-600">
                Choose from our library of poses and follow along with AI guidance for perfect alignment.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white shadow-lg rounded-xl p-8 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                📊
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 3: Get Real-time Feedback</h3>
              <p className="text-gray-600">
                Receive instant corrections and track your progress with detailed analytics and insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose YoJa?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "CNN-Powered Detection",
                desc: "Advanced neural networks for accurate pose recognition",
              },
              {
                title: "Real-time Feedback",
                desc: "Instant corrections as you practice",
              },
              {
                title: "Privacy First",
                desc: "Your data never leaves your device",
              },
              {
                title: "Progress Tracking",
                desc: "Detailed analytics and improvement insights",
              },
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 text-left">
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demo;
