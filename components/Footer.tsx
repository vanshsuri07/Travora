import { Link } from 'react-router';
import { footers } from '../app/constants';

const Footer = () => {
  const socialLinks = [
    { href: '#', icon: '/assets/icons/google.svg' },
  ];

  return (
    <footer className="bg-dark-200 text-white font-inter">
      <div className="wrapper py-12">
        <div className="footer-container flex-col md:flex-row gap-8">
          {/* Logo and Copyright */}
          <div className="text-center md:text-left">
            <Link to="/users/home">
              <img src="/assets/icons/logo.svg" alt="Travora Logo" className="h-8 mx-auto md:mx-0" />
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Travora. All rights reserved.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex gap-8">
            {footers.map((link) => (
              <a key={link} href="#" className="text-gray-300 hover:text-white">
                {link}
              </a>
            ))}
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <a key={index} href={social.href} className="text-white hover:text-gray-300">
                <img src={social.icon} alt="Social Icon" className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
