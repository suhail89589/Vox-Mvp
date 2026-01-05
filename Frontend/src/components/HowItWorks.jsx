import { UploadCloud, BrainCircuit, Mic, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Upload PDF",
      description:
        "Drag & drop your study material. We securely extract text and prepare it for AI analysis.",
      icon: <UploadCloud size={32} strokeWidth={1.5} />,
      color: "indigo",
      gradient: "from-indigo-500 to-blue-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      border: "border-indigo-100 dark:border-indigo-800",
      text: "text-indigo-600 dark:text-indigo-400",
    },
    {
      id: 2,
      title: "AI Analysis",
      description:
        "Our engine scans for key concepts, generating instant summaries and complex details.",
      icon: <BrainCircuit size={32} strokeWidth={1.5} />,
      color: "purple",
      gradient: "from-purple-500 to-fuchsia-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-100 dark:border-purple-800",
      text: "text-purple-600 dark:text-purple-400",
    },
    {
      id: 3,
      title: "Voice Interaction",
      description:
        "Listen naturally. Tap the mic to interrupt, ask questions, or dive deeper into topics.",
      icon: <Mic size={32} strokeWidth={1.5} />,
      color: "pink",
      gradient: "from-pink-500 to-rose-500",
      bg: "bg-pink-50 dark:bg-pink-900/20",
      border: "border-pink-100 dark:border-pink-800",
      text: "text-pink-600 dark:text-pink-400",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden"
      id="how-it-works"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Simple Process
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6"
          >
            From Static PDF to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Active Conversation
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Turn any document into an interactive learning partner in just three
            simple steps.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
        >
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 z-0">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <line
                x1="0"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="text-slate-200 dark:text-slate-800"
              />
            </svg>
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className="relative flex flex-col items-center text-center group z-10"
            >
              {/* Card Container */}
              <div className="relative mb-8">
                {/* Icon Circle */}
                <div
                  className={`
                    w-24 h-24 rounded-[2rem] flex items-center justify-center 
                    bg-white dark:bg-slate-900 
                    border-2 ${step.border}
                    shadow-xl shadow-slate-200/50 dark:shadow-none
                    group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 ease-out
                    relative z-10
                  `}
                >
                  <div className={`p-4 rounded-xl ${step.bg} ${step.text}`}>
                    {step.icon}
                  </div>
                </div>

                {/* Step Number Badge */}
                <div
                  className={`
                  absolute -top-3 -right-3 w-8 h-8 rounded-full 
                  bg-gradient-to-br ${step.gradient} 
                  flex items-center justify-center text-white font-bold text-sm shadow-lg
                  group-hover:scale-110 transition-transform duration-300 delay-75
                  z-20
                `}
                >
                  {step.id}
                </div>

                {/* Decorative Blob */}
                <div
                  className={`
                  absolute inset-0 rounded-[2rem] bg-gradient-to-br ${step.gradient} 
                  opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10
                `}
                />
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

              {/* Mobile Arrow (Visual Cue) */}
              {index < steps.length - 1 && (
                <div className="md:hidden mt-8 text-slate-300 dark:text-slate-700">
                  <ArrowRight className="rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
