'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowUp, ChevronDown } from 'lucide-react';

const Footer = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = {
    forJobSeekers: {
      title: 'For Job Seekers',
      links: [
        { name: 'Browse Jobs', href: '/jobs' },
        { name: 'Career Advice', href: '/resources/career' },
        { name: 'Resume Builder', href: '/tools/resume' },
        { name: 'Salary Guide', href: '/resources/salary' },
        { name: 'Skill Assessment', href: '/tools/assessment' }
      ]
    },
    forEmployers: {
      title: 'For Employers',
      links: [
        { name: 'Post a Job', href: '/recruiter/post-job' },
        { name: 'Pricing Plans', href: '/hire/pricing' },
        { name: 'Enterprise Solutions', href: '/hire/enterprise' },
        { name: 'Recruitment Tools', href: '/hire/tools' },
        { name: 'Success Stories', href: '/hire/success-stories' }
      ]
    },
    company: {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Partners', href: '/partners' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Community', href: '/community' },
        { name: 'Status', href: '/status' }
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'GDPR', href: '/gdpr' },
        { name: 'Accessibility', href: '/accessibility' }
      ]
    }
  };

  const socialLinks = [
    { icon: 'f', href: 'https://facebook.com/jobspark', label: 'Facebook' },
    { icon: '𝕏', href: 'https://twitter.com/jobspark', label: 'Twitter' },
    { icon: 'in', href: 'https://linkedin.com/company/jobspark', label: 'LinkedIn' },
    { icon: '📷', href: 'https://instagram.com/jobspark', label: 'Instagram' },
    { icon: '▶', href: 'https://youtube.com/jobspark', label: 'YouTube' }
  ];

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'islammasayekh@gmail.com', href: 'mailto:islammasayekh@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, label: 'Address', value: 'Dhaka, Bangladesh', href: 'https://maps.google.com/?q=Dhaka+Bangladesh' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Top Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {/* Links */}
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key}>
                <button
                  onClick={() => setActiveSection(activeSection === key ? null : key)}
                  className="flex items-center justify-between w-full text-left lg:hidden mb-4"
                >
                  <h4 className="font-semibold">{section.title}</h4>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeSection === key ? 'rotate-180' : ''}`} />
                </button>
                <div className={`${activeSection === key || !activeSection ? 'block' : 'hidden'} lg:block`}>
                  <h4 className="font-semibold mb-4 hidden lg:block">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact Information</h4>
              <div className="space-y-3">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={index}
                      href={info.href}
                      className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{info.value}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-300 font-bold text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © 2024 JobSpark. All rights reserved.
            </div>

            {/* Bottom Links */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <a href="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-300">
                Sitemap
              </a>
              <a href="/security" className="text-gray-400 hover:text-white transition-colors duration-300">
                Security
              </a>
              <a href="/compliance" className="text-gray-400 hover:text-white transition-colors duration-300">
                Compliance
              </a>
              <a href="/api" className="text-gray-400 hover:text-white transition-colors duration-300">
                API
              </a>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
