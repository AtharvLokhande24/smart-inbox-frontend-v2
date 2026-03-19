import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { HiCheck, HiX } from "react-icons/hi";

const PricingPage = () => {
  const [yearly, setYearly] = useState(false);

  const price = (monthly) => (yearly ? monthly * 10 : monthly);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <Navbar />

      {/* HERO */}
      <div className="text-center pt-20">
        <h1 className="text-5xl font-bold text-gray-900">
          Pricing that scales with you 
        </h1>
        <p className="mt-4 text-gray-600">
          Choose a plan and boost your productivity.
        </p>

        {/* TOGGLE */}
        <div className="flex justify-center mt-8">
          <div className="bg-gray-200 rounded-full p-1 flex">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-2 rounded-full ${
                !yearly ? "bg-white shadow" : ""
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-2 rounded-full ${
                yearly ? "bg-white shadow" : ""
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mt-16 px-6">

        {/* FREE */}
        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="text-3xl font-bold mt-4">₹0</p>
          <ul className="mt-6 space-y-2 text-gray-600">
            <li>✔ Basic AI prioritization</li>
            <li>✔ Gmail integration</li>
          </ul>
          <button className="mt-6 w-full py-2 bg-gray-200 rounded-lg">
            Get Started
          </button>
        </div>

        {/* PRO */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-indigo-500 scale-105 relative hover:-translate-y-2 transition-all duration-300">
          <span className="absolute top-3 right-3 text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
            Most Popular
          </span>

          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="text-3xl font-bold mt-4">
            ₹{price(499)}{yearly ? "/yr" : "/mo"}
          </p>

          <ul className="mt-6 space-y-2 text-gray-600">
            <li>✔ Advanced AI insights</li>
            <li>✔ Smart summaries</li>
            <li>✔ Priority alerts</li>
          </ul>

          <button className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Upgrade
          </button>
        </div>

        {/* ENTERPRISE */}
        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <h2 className="text-xl font-semibold">Enterprise</h2>
          <p className="text-3xl font-bold mt-4">Custom</p>
          <ul className="mt-6 space-y-2 text-gray-600">
            <li>✔ Team collaboration</li>
            <li>✔ Custom AI models</li>
          </ul>
          <button className="mt-6 w-full py-2 bg-gray-900 text-white rounded-lg">
            Contact Us
          </button>
        </div>

      </div>

      
      {/* FEATURE COMPARISON */}
      <div className="max-w-6xl mx-auto mt-24 px-6 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Compare Plans
        </h2>

        <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-200">
          <table className="w-full text-sm text-left">

            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700">
              <tr>
                <th className="p-5 font-semibold">Features</th>
                <th className="text-center">Free</th>
                <th className="text-center bg-indigo-50 text-indigo-600">Pro </th>
                <th className="text-center">Enterprise</th>
              </tr>
            </thead>

            <tbody className="bg-white">

              <tr className="border-t hover:bg-gray-50">
                <td className="p-5 font-medium">
                  AI Prioritization
                  <p className="text-xs text-gray-500">Rank emails automatically</p>
                </td>
                <td className="text-center text-green-600"><HiCheck className="mx-auto" /></td>
                <td className="text-center text-green-600 bg-indigo-50"><HiCheck className="mx-auto" /></td>
                <td className="text-center text-green-600"><HiCheck className="mx-auto" /></td>
              </tr>

              <tr className="border-t hover:bg-gray-50">
                <td className="p-5 font-medium">
                  Smart Summary
                  <p className="text-xs text-gray-500">AI summaries</p>
                </td>
                <td className="text-center text-gray-400"><HiX className="mx-auto" /></td>
                <td className="text-center text-green-600 bg-indigo-50"><HiCheck className="mx-auto" /></td>
                <td className="text-center text-green-600"><HiCheck className="mx-auto" /></td>
              </tr>

              <tr className="border-t hover:bg-gray-50">
                <td className="p-5 font-medium">
                  Team Collaboration
                </td>
                <td className="text-center text-gray-400"><HiX className="mx-auto" /></td>
                <td className="text-center text-gray-400 bg-indigo-50"><HiX className="mx-auto" /></td>
                <td className="text-center text-green-600"><HiCheck className="mx-auto" /></td>
              </tr>

            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

export default PricingPage;