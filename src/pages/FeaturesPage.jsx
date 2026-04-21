import React from "react";
import Navbar from "../components/Navbar";
import { HiOutlineLightningBolt, HiOutlineMail, HiOutlineChartBar } from "react-icons/hi";

const features = [
  {
    icon: <HiOutlineLightningBolt size={28} />,
    title: "AI Priority Detection",
    desc: "Automatically identify the most important emails using AI.",
  },
  {
    icon: <HiOutlineChartBar size={28} />,
    title: "Insights & Analytics",
    desc: "Track productivity and email patterns.",
  },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      <Navbar />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.26),_transparent_34%),radial-gradient(circle_at_80%_15%,_rgba(168,85,247,0.18),_transparent_28%),linear-gradient(to_bottom,_rgba(2,6,23,0),_rgba(2,6,23,0.65))]" />

        {/* HERO */}
        <section className="relative max-w-6xl mx-auto text-center pt-20 px-6 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300 shadow-lg shadow-black/20">
            Smart Inbox features
          </div>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-50 sm:text-6xl">
            Powerful features built for a dark workspace
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Smart Inbox helps you focus on what matters using AI-powered insights, fast prioritization, and a calm interface that stays readable at a glance.
          </p>
        </section>

        {/* FEATURE CARDS */}
        <section className="relative max-w-6xl mx-auto grid gap-8 px-6 pb-24 md:grid-cols-2">
          {features.map((f, i) => (
            <article
              key={i}
              className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-500/60 hover:bg-slate-900"
            >
              <div className="mb-5 inline-flex rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-300 transition group-hover:bg-indigo-500/15">
                {f.icon}
              </div>
              <h2 className="text-xl font-semibold text-slate-50">{f.title}</h2>
              <p className="mt-3 text-slate-300">{f.desc}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default FeaturesPage;