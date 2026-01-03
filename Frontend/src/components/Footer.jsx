import React from "react";
import { Twitter, Linkedin, Instagram, Facebook, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
          <div className="lg:col-span-2 space-y-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-900"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                V
              </div>
              VisionTutor
            </Link>
            <p className="text-slate-500 leading-relaxed max-w-sm text-base">
              Empowering the visually impaired through accessible, AI-driven
              education technology. Building the future of inclusive learning
              for everyone.
            </p>
            <div className="flex gap-4">
              <SocialLink
                href="#"
                icon={<Twitter size={18} />}
                label="Twitter"
              />
              <SocialLink
                href="#"
                icon={<Linkedin size={18} />}
                label="LinkedIn"
              />
              <SocialLink
                href="#"
                icon={<Instagram size={18} />}
                label="Instagram"
              />
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <FooterLink to="/about">About Us</FooterLink>
              </li>
              <li>
                <FooterLink to="/features">Features</FooterLink>
              </li>
              <li>
                <FooterLink to="/pricing">For Schools</FooterLink>
              </li>
              <li>
                <FooterLink to="/contact">Contact Support</FooterLink>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink to="/terms">Terms of Service</FooterLink>
              </li>
              <li>
                <FooterLink to="/accessibility">Accessibility</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {currentYear} VisionTutor AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart size={14} className="text-red-500 fill-red-500" />
            <span>for an inclusive world.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Sub Components ---
const FooterLink = ({ to, children }) => (
  <Link to={to} className="hover:text-indigo-600 transition-colors block w-fit">
    {children}
  </Link>
);

const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all shadow-sm"
  >
    {icon}
  </a>
);

export default Footer;
