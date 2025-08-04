// BlogPage.jsx
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "5 Postures You're Doing Wrong (And How AI Can Fix Them)",
    tag: "AI Yoga",
    summary:
      "Discover the most common yoga mistakes and learn how our AI technology can help you perfect your form.",
    author: "Aarti Sharma",
    date: "June 15, 2024",
    image:
      "https://plus.unsplash.com/premium_photo-1661777196224-bfda51e61cfd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "The Science Behind Real-Time Posture Correction",
    tag: "Technology",
    summary:
      "Explore how convolutional neural networks and computer vision work together to analyze your yoga poses.",
    author: "Raj Kumar",
    date: "June 10, 2024",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Building a Daily Yoga Practice: A Beginner's Guide",
    tag: "Yoga Basics",
    summary:
      "Start your yoga journey with confidence using these expert tips and AI-powered guidance.",
    author: "Priya Mehta",
    date: "June 5, 2024",
    image:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "The Future of Fitness: AI-Powered Wellness",
    tag: "Wellness",
    summary:
      "How artificial intelligence is revolutionizing the way we approach health and wellness practices.",
    author: "Vikram Singh",
    date: "May 28, 2024",
    image:
      "https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    title: "Mindfulness Meets Technology: Finding Balance",
    tag: "Mindfulness",
    summary:
      "Discover how to maintain mindfulness while using technology to enhance your yoga practice.",
    author: "Priya Mehta",
    date: "May 20, 2024",
    image:
      "https://images.unsplash.com/photo-1529693662653-9d480530a697?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    title: "Community Challenges: Growing Together in Yoga",
    tag: "Community",
    summary:
      "Join our monthly yoga challenges and connect with practitioners around the world.",
    author: "Aarti Sharma",
    date: "May 15, 2024",
    image:
      "https://images.unsplash.com/photo-1517363898874-737b62a7db91?q=80&w=1963&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const tags = ["AI Yoga", "Technology", "Yoga Basics", "Wellness", "Mindfulness", "Community"];

const Blog = () => {
  const [page, setPage] = useState(1);
  const postsPerPage = 2;
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const visiblePosts = blogPosts.slice(start, end);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gray-900">Explore Yoga, Wellness, and AI</h1>
        <p className="text-gray-600 mt-4 text-lg">
          Stay updated with tips, stories, and tech insights from YoJa experts
        </p>
        <button className="mt-6 bg-sky-500 text-white px-6 py-2 rounded-full hover:bg-sky-600 transition">
          Subscribe to Newsletter
        </button>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Blog Section */}
        <div className="lg:col-span-2 space-y-6">
          {visiblePosts.map((post, index) => (
            <motion.div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <span className="text-sm text-sky-500 font-medium">#{post.tag}</span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">{post.title}</h2>
                <p className="text-gray-600 mt-1">{post.summary}</p>
                <div className="mt-4 text-sm text-gray-500 flex justify-between">
                  <span>Author: {post.author}</span>
                  <span>Date: {post.date}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="text-blue-500 px-4 py-2 rounded hover:bg-blue-50 border"
            >
              Previous
            </button>
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-4 py-2 rounded-full ${
                  page === num ? "bg-blue-500 text-white" : "border hover:bg-blue-50"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === 3}
              className="text-blue-500 px-4 py-2 rounded hover:bg-blue-50 border"
            >
              Next
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          {/* Tags */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm border border-blue-200 cursor-pointer hover:bg-blue-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
            <ul className="space-y-4">
              {blogPosts.slice(0, 3).map((post) => (
                <li key={post.id} className="flex items-center gap-3">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-14 h-14 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500">{post.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
