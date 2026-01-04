import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, PlayCircle, Mic } from "lucide-react";

import img1 from "../assets/images/download.png";
import img2 from "../assets/images/download1.png";
import img3 from "../assets/images/download2.png";
import img4 from "../assets/images/download3.png";

const HERO_IMAGES = [
  {
    id: 1,
    src: img1,
    alt: "Visually impaired student learning with tablet",
  },
  {
    id: 2,
    src: img2,
    alt: "Accessible technology in classroom",
  },
  {
    id: 3,
    src: img3,
    alt: "Student using assistive software",
  },
  {
    id: 4,
    src: img4,
    alt: "Voice enabled learning session",
  },
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
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* LEFT: IMAGE CAROUSEL */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative w-full max-w-lg lg:max-w-none"
          >
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100 z-20">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={HERO_IMAGES[currentImageIndex].src}
                  alt={HERO_IMAGES[currentImageIndex].alt}
                  loading="lazy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Floating Voice Indicator */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 z-30 flex items-center gap-3"
              >
                <div className="bg-green-100 p-2 rounded-full text-green-600 animate-pulse">
                  <Mic size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">
                    Voice Mode
                  </p>
                  <p className="text-sm font-extrabold text-slate-900">
                    Listening…
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Background blobs */}
            <div className="absolute top-10 -right-10 w-64 h-64 bg-blue-200/50 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-violet-200/50 rounded-full blur-3xl -z-10" />
          </motion.div>

          {/* RIGHT: CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI Tutor for Accessibility
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Learning Without <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                Limits.
              </span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              VisionTutor empowers visually impaired students to read, learn,
              and grow using advanced AI voice interaction.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"
              >
                <PlayCircle size={20} /> Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
