import React from "react";

const CalCount = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
          Daily Calorie Counter
        </h1>
        <p className="text-gray-600 mt-2">
          Track your nutrition and maintain a healthy lifestyle
        </p>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          {
            icon: "🍽️",
            value: "1450/2000",
            label: "Calories",
            color: "orange-400",
            percent: "72.5%",
          },
          {
            icon: "💧",
            value: "6/8",
            label: "Glasses of Water",
            color: "blue-400",
            percent: "75%",
          },
          {
            icon: "📈",
            value: "8,500",
            label: "Steps Today",
            color: "green-400",
            percent: "85%",
          },
          {
            icon: "⚖️",
            value: "65",
            label: "kg",
            subtext: "-0.5kg this week",
            color: "purple-400",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow border p-6 flex flex-col items-center"
          >
            <span className={`text-3xl text-${item.color} mb-2`}>{item.icon}</span>
            <div className="text-blue-900 font-bold text-2xl">{item.value}</div>
            <div className="text-gray-500 text-sm mb-2">{item.label}</div>
            {item.percent && (
              <div className="w-full h-2 bg-gray-100 rounded">
                <div
                  className={`h-2 bg-${item.color} rounded transition-all duration-500`}
                  style={{ width: item.percent }}
                ></div>
              </div>
            )}
            {item.subtext && (
              <div className="text-green-500 text-xs mt-2">{item.subtext}</div>
            )}
          </div>
        ))}
      </section>

      {/* Main Content Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow border p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">🍽️</span>
              <h2 className="text-xl font-semibold text-blue-800">
                Today’s Meals
              </h2>
            </div>

           
            {[
              {
                title: "Breakfast",
                time: "8:00 AM",
                items: ["Oatmeal", "Banana", "Almonds"],
                calories: 350,
              },
              {
                title: "Lunch",
                time: "1:00 PM",
                items: ["Quinoa Bowl", "Grilled Chicken", "Vegetables"],
                calories: 550,
              },
              {
                title: "Snack",
                time: "4:00 PM",
                items: ["Greek Yogurt", "Berries"],
                calories: 150,
              },
              {
                title: "Dinner",
                time: "7:30 PM",
                items: ["Salmon", "Sweet Potato", "Broccoli"],
                calories: 400,
              },
            ].map((meal, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-blue-50 rounded-lg px-4 py-3 mb-3"
              >
                <div>
                  <div className="font-semibold text-blue-900">{meal.title}</div>
                  <div className="text-xs text-gray-500">{meal.time}</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {meal.items.map((item, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-sky-500 text-xs px-2 py-0.5 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="font-bold text-sky-500 text-lg">
                  {meal.calories} cal
                </div>
              </div>
            ))}

            <button className="w-full mt-5 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition">
              + Add New Meal
            </button>
          </div>
        </div>

        {/* Quick Log & Nutrition Tips */}
        <div className="flex flex-col gap-6">
       
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="text-lg font-semibold text-sky-600 mb-4">
              Quick Log
            </h3>
            <form className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-full">
                  <label className="block text-sm text-gray-600 mb-1">
                    Water (glasses)
                  </label>
                  <input
                    type="number"
                    defaultValue={0}
                    min={0}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm text-gray-600 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    defaultValue={0}
                    min={0}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition"
              >
                Update
              </button>
            </form>
          </div>

          {/* Nutrition Tips */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-3">
              Nutrition Tips
            </h3>
            <ul className="list-disc pl-5 text-green-800 space-y-1 text-sm">
              <li>Drink water before meals to aid digestion</li>
              <li>Include protein in every meal for energy</li>
              <li>Eat colorful vegetables for balanced nutrition</li>
              <li>Practice mindful eating during yoga days</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default CalCount;
