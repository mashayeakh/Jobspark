'use client';

import React, { useState } from 'react';
import { Mail, Phone, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/api';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await apiClient.post('/contact/send', formData);

    setIsSubmitting(false);

    if (!response.success) {
      toast.error(response.error || 'Unable to send your message. Please try again later.');
      return;
    }

    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'islammasayekh@gmail.com',
      link: 'mailto:islammasayekh@gmail.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-[0.25em] mb-4">Contact JobSpark</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Reach out with any question</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Send your message and our team will reply to islammasayekh@gmail.com. Use the form below for support, inquiries, or feedback.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr,1.4fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <Link
                      key={index}
                      href={info.link}
                      className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{info.title}</p>
                        <p className="font-medium text-gray-900">{info.value}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Need help fast?</h3>
              <p className="text-gray-600">If your message is urgent, email islammasayekh@gmail.com directly. Otherwise, use the form and we’ll respond as soon as possible.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-600">Send a message</p>
                <h2 className="text-2xl font-semibold text-gray-900">We’re here to help</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="John Doe"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="john@example.com"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Subject
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" disabled>Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Product Feedback</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Message
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="How can we help you?"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 px-6 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
