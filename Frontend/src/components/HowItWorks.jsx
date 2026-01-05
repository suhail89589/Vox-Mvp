import { UploadCloud, BrainCircuit, Mic } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Upload Your PDF",
      description:
        "Simply drag and drop your study material. We extract the text securely and prepare it for analysis.",
      icon: <UploadCloud size={40} className="text-indigo-600" />,
      bg: "bg-indigo-50",
    },
    {
      id: 2,
      title: "AI Analysis",
      description:
        "Our advanced AI scans your document to understand key concepts, summaries, and complex details instantly.",
      icon: <BrainCircuit size={40} className="text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      id: 3,
      title: "Voice Interaction",
      description:
        "The AI reads to you naturally. Just tap the mic to interrupt and ask questions like a real conversation.",
      icon: <Mic size={40} className="text-pink-600" />,
      bg: "bg-pink-50",
    },
  ];

  return (
    <section className="py-24 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm">
            Simple Process
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How Vision Tutor Works
          </p>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Turn any static document into an interactive learning partner in seconds.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 -z-10"></div>

          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center group">
              {/* Icon Circle */}
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${step.bg} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-white`}
              >
                {step.icon}
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;