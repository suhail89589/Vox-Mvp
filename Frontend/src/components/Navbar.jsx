import React, { useState } from "react";
import { Menu, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToUpload = () => {
    document
      .getElementById("upload-section")
      ?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200"
      >
        <div className="container mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
              V
            </div>
            VisionTutor
          </div>

          <div className="hidden md:flex">
            <button
              onClick={scrollToUpload}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold"
            >
              <Upload size={16} /> Upload PDF
            </button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div className="fixed right-0 top-0 bottom-0 w-3/4 bg-white z-50 p-6 pt-24">
              <button
                onClick={scrollToUpload}
                className="w-full flex gap-3 bg-indigo-600 text-white p-4 rounded-xl"
              >
                <Upload /> Upload PDF
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
