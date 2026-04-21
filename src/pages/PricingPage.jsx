import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { HiCheck, HiX } from "react-icons/hi";

const PricingPage = () => {
  const [yearly, setYearly] = useState(false);

  const price = (monthly) => (yearly ? monthly * 10 : monthly);

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      <Navbar />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.26),_transparent_32%),radial-gradient(circle_at_80%_15%,_rgba(168,85,247,0.18),_transparent_28%),linear-gradient(to_bottom,_rgba(2,6,23,0),_rgba(2,6,23,0.7))]" />

        {/* HERO */}
        <section className="relative max-w-6xl mx-auto px-6 pt-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300 shadow-lg shadow-black/20">
            Simple pricing
          </div>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-50 sm:text-6xl">
            Pricing that scales with your inbox
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Choose a plan that matches your workflow. Everything is tuned for a dark interface, fast scanning, and minimal distraction.
          </p>

          {/* TOGGLE */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex rounded-full border border-slate-800 bg-slate-900/80 p-1 shadow-lg shadow-black/20">
              <button
                onClick={() => setYearly(false)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  !yearly ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30" : "text-slate-300 hover:text-slate-100"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  yearly ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30" : "text-slate-300 hover:text-slate-100"
                }`}
              >
                Yearly save 20%
              </button>
            </div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="relative max-w-6xl mx-auto grid gap-8 px-6 pt-16 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-50">Free</h2>
            <p className="mt-4 text-4xl font-semibold text-slate-50">₹0</p>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li>Basic AI prioritization</li>
              <li>Gmail integration</li>
            </ul>
            <button className="mt-8 w-full rounded-xl border border-slate-700 bg-slate-950/60 py-3 font-medium text-slate-100 transition hover:border-indigo-500/50 hover:bg-slate-900">
              Get Started
            </button>
          </article>

          <article className="relative rounded-3xl border border-indigo-500/60 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] shadow-indigo-950/20 transition duration-300 hover:-translate-y-1">
            <span className="absolute right-4 top-4 rounded-full border border-indigo-400/40 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-200">
              Most popular
            </span>
            <h2 className="text-xl font-semibold text-slate-50">Pro</h2>
            <p className="mt-4 text-4xl font-semibold text-slate-50">
              ₹{price(499)}<span className="text-base font-medium text-slate-400">{yearly ? "/yr" : "/mo"}</span>
            </p>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li>Advanced AI insights</li>
              <li>Smart summaries</li>
              <li>Priority alerts</li>
            </ul>
            <button className="mt-8 w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400">
              Upgrade
            </button>
          </article>

          <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-50">Enterprise</h2>
            <p className="mt-4 text-4xl font-semibold text-slate-50">Custom</p>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li>Team collaboration</li>
              <li>Custom AI models</li>
            </ul>
            <button className="mt-8 w-full rounded-xl border border-slate-700 bg-slate-950/60 py-3 font-medium text-slate-100 transition hover:border-indigo-500/50 hover:bg-slate-900">
              Contact Us
            </button>
          </article>
        </section>

        {/* FEATURE COMPARISON */}
        <section className="relative max-w-6xl mx-auto px-6 pb-24 pt-20">
          <h2 className="text-center text-3xl font-semibold text-slate-50">
            Compare plans
          </h2>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-200">
                <tr>
                  <th className="p-5 font-semibold">Features</th>
                  <th className="p-5 text-center font-semibold">Free</th>
                  <th className="p-5 text-center font-semibold text-indigo-200">Pro</th>
                  <th className="p-5 text-center font-semibold">Enterprise</th>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800/80 hover:bg-white/5">
                  <td className="p-5 font-medium text-slate-100">
                    AI prioritization
                    <p className="mt-1 text-xs text-slate-400">Rank emails automatically</p>
                  </td>
                  <td className="p-5 text-center text-emerald-400"><HiCheck className="mx-auto" /></td>
                  <td className="bg-indigo-500/10 p-5 text-center text-emerald-400"><HiCheck className="mx-auto" /></td>
                  <td className="p-5 text-center text-emerald-400"><HiCheck className="mx-auto" /></td>
                </tr>

                <tr className="hover:bg-white/5">
                  <td className="p-5 font-medium text-slate-100">
                    Team collaboration
                  </td>
                  <td className="p-5 text-center text-slate-500"><HiX className="mx-auto" /></td>
                  <td className="bg-indigo-500/10 p-5 text-center text-slate-500"><HiX className="mx-auto" /></td>
                  <td className="p-5 text-center text-emerald-400"><HiCheck className="mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PricingPage;