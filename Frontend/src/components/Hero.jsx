import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, PlayCircle, Mic } from "lucide-react";

import img1 from "../assets/images/download.png";
import img2 from "../assets/images/download1.png";
import img3 from "../assets/images/download2.png";
import img4 from "../assets/images/download3.png";

const HERO_IMAGES = [
  { id: 1, src: img1, alt: "Visually impaired student learning with tablet" },
  { id: 2, src: img2, alt: "Accessible technology in classroom" },
  { id: 3, src: img3, alt: "Student using assistive software" },
  { id: 4, src: img4, alt: "Voice enabled learning session" },
];

const HomeHero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 relative w-full max-w-lg lg:max-w-none"
          >
            {/* Main Image Frame */}
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-900 z-20 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={HERO_IMAGES[currentImageIndex].src}
                  alt={HERO_IMAGES[currentImageIndex].alt}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-8 left-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700 z-30 flex items-center gap-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20" />
                  <div className="bg-red-500 p-2.5 rounded-full text-white shadow-lg shadow-red-500/30">
                    <Mic size={20} />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                    Voice Mode
                  </p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    Always Listening
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Decorative Blobs */}
            <div className="absolute top-10 -right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] -z-10" />
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold border border-indigo-100 dark:border-indigo-800">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
              AI Tutor for Accessibility
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Learning Without <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                Barriers.
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
              VoxTutor empowers visually impaired students to read, learn, and
              grow using advanced AI voice interaction.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                <PlayCircle size={20} /> View Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
