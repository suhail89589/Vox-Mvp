import { Twitter, Linkedin, Instagram, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4 text-center space-y-8">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            VoxTutor
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">
            Empowering visually impaired learners through AI-driven, voice-first
            education.
          </p>
        </div>

        {/* Social Links Container */}
        <div className="flex justify-center gap-4 py-4">
          <Social
            icon={<Twitter size={20} />}
            href="https://twitter.com/MohdSuhail89589"
            label="Visit our Twitter"
            hoverColor="hover:text-sky-500 hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
          />
          <Social
            icon={<Linkedin size={20} />}
            href="https://linkedin.com/in/suhail-malik-7b5896366/"
            label="Visit our LinkedIn"
            hoverColor="hover:text-blue-700 hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          />
          <Social
            icon={<Instagram size={20} />}
            href="https://instagram.com/iam_suhail89589"
            label="Visit our Instagram"
            hoverColor="hover:text-pink-600 hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20"
          />
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500 flex items-center justify-center gap-1.5 font-medium">
            Made with{" "}
            <Heart
              className="text-red-500 fill-red-500 animate-pulse"
              size={16}
            />{" "}
            for accessibility
          </p>
        </div>
      </div>
    </footer>
  );
};

// Reusable Social Button Component
const Social = ({ icon, href, label, hoverColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`
      w-12 h-12 flex items-center justify-center rounded-2xl 
      border border-slate-200 dark:border-slate-700 
      text-slate-400 dark:text-slate-500 
      bg-white dark:bg-slate-900 
      transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
      ${hoverColor}
    `}
  >
    {icon}
  </a>
);

export default Footer;
