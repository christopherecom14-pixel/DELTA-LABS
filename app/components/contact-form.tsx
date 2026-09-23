"use client";

import { useState, FormEvent } from "react";

export function ContactForm({ hideHeading = false }: { hideHeading?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("System Architecture & AI");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }
    if (!message.trim()) {
      setErrorMessage("Please share details about your project.");
      return;
    }

    setIsSubmitting(true);

    try {
      const subject = encodeURIComponent(`Delta Labs Project Inquiry — ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nArea of Interest: ${service}\n\nProject Details:\n${message}`
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      setSubmitted(true);
      window.location.href = `mailto:hello@deltalabs.tech?subject=${subject}&body=${body}`;
    } catch {
      setErrorMessage("Something went wrong. Please email us directly at hello@deltalabs.tech");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl p-4 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center">
      {!hideHeading && (
        <div className="mb-6 sm:mb-8 md:mb-10">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-[#2e4dff] block mb-1.5 sm:mb-2">
            Project Intake
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-[#171a21] uppercase">
            Inquiry
          </h2>
        </div>
      )}

      {submitted ? (
        <div className="p-6 sm:p-8 bg-[#f0f3f8] border border-[#171a21] rounded-[4px] space-y-4 animate-in fade-in duration-300">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2e4dff] text-[#ffffff] flex items-center justify-center font-bold text-lg sm:text-xl shadow-sm">
            ✓
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-[#171a21]">
            Inquiry Dispatched
          </h3>
          <p className="text-[#636873] text-xs sm:text-sm leading-relaxed font-body">
            Thank you for reaching out. We will review your requirements and respond within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setName("");
              setEmail("");
              setMessage("");
            }}
            className="mt-3 sm:mt-4 text-xs font-bold uppercase tracking-widest text-[#2e4dff] hover:underline cursor-pointer"
          >
            Send another inquiry →
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8 md:gap-10 w-full">
          {/* Name Field */}
          <div className="relative flex flex-col group">
            <label
              htmlFor="name"
              className="text-[11px] sm:text-xs font-bold text-[#636873] uppercase tracking-[0.18em] mb-1.5"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="minimal-input w-full bg-transparent border-0 border-b-2 border-[#171a21] py-2 sm:py-2.5 px-0 focus:ring-0 placeholder:text-[#636873]/40 font-body text-[#171a21]"
            />
          </div>

          {/* Email Field */}
          <div className="relative flex flex-col group">
            <label
              htmlFor="email"
              className="text-[11px] sm:text-xs font-bold text-[#636873] uppercase tracking-[0.18em] mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="minimal-input w-full bg-transparent border-0 border-b-2 border-[#171a21] py-2 sm:py-2.5 px-0 focus:ring-0 placeholder:text-[#636873]/40 font-body text-[#171a21]"
            />
          </div>

          {/* Service Selector */}
          <div className="relative flex flex-col group">
            <label
              htmlFor="service"
              className="text-[11px] sm:text-xs font-bold text-[#636873] uppercase tracking-[0.18em] mb-1.5"
            >
              Area of Interest
            </label>
            <select
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="minimal-input w-full bg-transparent border-0 border-b-2 border-[#171a21] py-2 sm:py-2.5 px-0 focus:ring-0 font-body text-[#171a21] cursor-pointer"
            >
              <option value="System Architecture & AI">System Architecture & AI Agents</option>
              <option value="Workflow Automation">Workflow Automation & Integration</option>
              <option value="Custom Software">Custom Internal Software & Apps</option>
              <option value="Technical Advisory">Strategic Advisory & Architecture Review</option>
            </select>
          </div>

          {/* Message Field */}
          <div className="relative flex flex-col group">
            <label
              htmlFor="message"
              className="text-[11px] sm:text-xs font-bold text-[#636873] uppercase tracking-[0.18em] mb-1.5"
            >
              Project Details
            </label>
            <textarea
              id="message"
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about what you want to build or automate..."
              className="minimal-input w-full bg-transparent border-0 border-b-2 border-[#171a21] py-2 sm:py-2.5 px-0 focus:ring-0 placeholder:text-[#636873]/40 resize-none font-body text-[#171a21]"
            />
          </div>

          {errorMessage && (
            <p className="text-xs font-bold text-[#e11d48] uppercase tracking-wider">
              {errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-13 sm:h-16 md:h-18 bg-[#2e4dff] text-[#ffffff] text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.18em] rounded-[3px] flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[#171a21] cursor-pointer shadow-md ${
              isSubmitting ? "loading-pulse pointer-events-none" : ""
            }`}
          >
            <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
            {!isSubmitting && (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
