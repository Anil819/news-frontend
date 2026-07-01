import { Link } from "react-router-dom";
import {
  GraduationCap,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      Icon: Facebook,
      href: "https://www.facebook.com/sviomi/",
    },
    // {
    //   Icon: Twitter,
    //   href: "https://twitter.com/", 
    // },
    {
      Icon: Instagram,
      href: "https://www.instagram.com/svims_indore_/",
    },
    {
      Icon: Linkedin,
      href: "https://www.linkedin.com/school/shri-vaishnav-institute-of-management-science-indore/posts/?feedView=all",
    },
  ];
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold mb-3">
            <span className="bg-blue-600 rounded-lg p-1.5">
              <GraduationCap size={18} />
            </span>
            SVIMS NEWS PORTAL
          </div>
          <p className="text-sm text-gray-400">
            Your trusted source for campus news, events, placements and
            announcements.
          </p>
          <div className="flex gap-3 mt-4">
            {socialLinks.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-blue-600 transition-colors p-2 rounded-lg"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/news" className="hover:text-blue-500">
                News
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-blue-500">
                Events
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-blue-500">
                Gallery
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="hover:text-blue-500 cursor-pointer">
                Academics
              </span>
            </li>
            <li>
              <span className="hover:text-blue-500 cursor-pointer">
                Placements
              </span>
            </li>
            <li>
              <span className="hover:text-blue-500 cursor-pointer">Sports</span>
            </li>
            <li>
              <span className="hover:text-blue-500 cursor-pointer">
                Announcements
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              Sector B, Gumasta Nagar, Scheme 71, Indore, Madhya Pradesh 452009
            </li>
            <li>+91 98765 43210</li>
            <li>Svims@college.edu.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} College News Portal. All rights reserved.
      </div>
    </footer>
  );
}
