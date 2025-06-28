"use client"

import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen bg-black text-white overflow-hidden relative">
      {/* Header */}
      <header className="w-full py-6 relative z-10">
        <div className="container mx-auto px-4">
          <nav className="flex justify-end gap-4">
            <Link
              href="https://github.com/alok8bb/trackie"
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={18} className="text-white" />
            </Link>
            <Link
              href="https://twitter.com/alok8bb"
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter size={18} className="text-white" />
            </Link>
          </nav>
        </div>
      </header>
      

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col">
        <section className="w-full py-8 flex-1 flex flex-col justify-center mt-28">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center space-y-8">
              {/* Title and Subtitle */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl text-white">
                  trackie
                </h1>
                <p className="mx-auto max-w-[600px] text-gray-400 text-lg md:text-xl">
                  A simple habit tracker for web. Build better habits, track your progress, and achieve your goals.
                </p>
              </div>

              <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10" onClick={() => {
                  window.location.href = "/tracker";
                }}>
                  <span>
                    Continue to App
                  </span>
                  <svg
                    fill="none"
                    height="16"
                    viewBox="0 0 24 24"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.75 8.75L14.25 12L10.75 15.25"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
              </button>

              {/* App Screenshot with fade effect */}
              <div className="w-full max-w-4xl mt-8 relative">
                <div className="relative">
                  <img
                    src="/screenshot.png"
                    width={800}
                    height={400}
                    alt="Trackie app screenshot"
                    className="w-full h-auto rounded-lg"
                  />
                  {/* Gradient overlay to fade into black background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black rounded-lg pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
