import { Twitter, Linkedin, Instagram, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-6">
      <div className="container mx-auto px-4 text-center space-y-6">
        <p className="text-slate-600 max-w-xl mx-auto">
          VisionTutor empowers visually impaired learners through AI-driven,
          voice-first education.
        </p>

        <div className="flex justify-center gap-4">
          <Social icon={<Twitter />} />
          <Social icon={<Linkedin />} />
          <Social icon={<Instagram />} />
        </div>

        <p className="text-sm text-slate-500 flex justify-center gap-1">
          Made with <Heart className="text-red-500" size={14} /> for
          accessibility
        </p>
      </div>
    </footer>
  );
};

const Social = ({ icon }) => (
  <span className="w-9 h-9 flex items-center justify-center rounded-full border cursor-not-allowed text-slate-400">
    {icon}
  </span>
);

export default Footer;
