// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Menu, X, Upload, BookOpen, ChevronRight } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Detect scroll to adjust navbar styling
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const scrollToUpload = () => {
    setIsOpen(false);
    document
      .getElementById("upload-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Animation Variants
  const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled
              ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm py-3"
              : "bg-transparent py-5"
          }
        `}
      >
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
          {/* LOGO */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300 transform group-hover:scale-105">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              VoxTutor
            </span>
          </div>

          {/* DESKTOP ACTIONS (Toggle Removed) */}
          <div className="hidden md:flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToUpload}
              className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:bg-slate-800 dark:hover:bg-slate-100"
            >
              <Upload size={16} strokeWidth={2.5} />
              <span>Upload PDF</span>
            </motion.button>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-out Menu */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 z-50 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex justify-end mb-8">
                {/* Spacer or additional close button if needed */}
              </div>

              <div className="flex flex-col gap-6 flex-1">
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                    Menu
                  </h3>
                  {["Features", "Pricing", "About"].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between text-lg font-medium text-slate-700 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-900"
                    >
                      {item}
                      <ChevronRight size={16} className="text-slate-400" />
                    </a>
                  ))}
                </motion.div>

                {/* Bottom Actions (Appearance Section Removed) */}
                <motion.div
                  variants={itemVariants}
                  className="mt-auto space-y-4"
                >
                  <button
                    onClick={scrollToUpload}
                    className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white p-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <Upload size={20} /> Upload PDF
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
