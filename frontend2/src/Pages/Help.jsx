import React, { useState } from "react";

const faqs = [
  { question: "How does AI posture correction work?", answer: "Our system uses real-time pose detection to analyze and correct your posture using AI." },
  { question: "What equipment do I need to get started?", answer: "A phone or webcam-enabled device and a stable surface to practice yoga." },
  { question: "Can I practice without an internet connection?", answer: "Offline mode is limited. Internet is needed for real-time AI corrections." },
  { question: "How do I track my progress?", answer: "You can track progress through personalized dashboards and reports." },
  { question: "Are the yoga routines suitable for beginners?", answer: "Yes, our routines are designed for all levels including beginners." },
  { question: "How accurate is the pose detection?", answer: "The system is trained on thousands of poses and offers high accuracy." },
  { question: "Can I customize my practice schedule?", answer: "Yes, the platform allows you to create your own yoga plans." }
];

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0084c6]">Help & Support</h1>
          <p className="text-gray-600 text-lg mt-2">
            Find answers to common questions or contact our support team
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: FAQs */}
          <div className="md:col-span-2 bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold text-[#0084c6] mb-4 flex items-center gap-2">
              <span>❓</span> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-blue-100 rounded-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-[#0084c6] font-medium flex justify-between items-center"
                  >
                    {faq.question}
                    <span>{openIndex === index ? "▲" : "▼"}</span>
                  </button>
                  {openIndex === index && (
                    <div className="bg-white px-4 py-3 text-gray-700 text-sm">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Help and Feedback */}
          <div className="space-y-8">
            {/* Quick Help */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="text-lg font-semibold text-[#0084c6] mb-4">
                Quick Help
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block w-full text-center bg-[#0084c6] text-white rounded-md py-2 hover:bg-[#0072b0]"
                >
                  💬 Live Chat Support
                </a>
                <a
                  href="mailto:support@example.com"
                  className="block w-full text-center border border-[#0084c6] text-[#0084c6] rounded-md py-2 hover:bg-blue-50"
                >
                  ✉️ Email Support
                </a>
                <p className="text-sm text-gray-500 text-center">
                  Average response time: 2–4 hours
                </p>
              </div>
            </div>

            {/* Send Feedback */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="text-lg font-semibold text-[#0084c6] mb-4">
                Send Feedback
              </h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <textarea
                  rows={3}
                  placeholder="How can we help you? Share your feedback, questions, or suggestions..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="w-full bg-[#0084c6] text-white rounded-md py-2 hover:bg-[#0072b0]"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
