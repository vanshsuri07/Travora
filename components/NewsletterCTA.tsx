import React, { useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Defines variants for Framer Motion animations.
// This function is now inside the component file to resolve the import error.
const fadeIn = (
  direction: "up" | "down" | "left" | "right",
  delay: number
) => {
  return {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "tween" as const,
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

interface NewsletterCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  placeholder?: string;
}

const NewsletterCTA: React.FC<NewsletterCTAProps> = ({
  title = "Subscribe to Our Newsletter",
  description = "Get the latest news, updates, and exclusive content straight to your inbox.",
  buttonText = "Subscribe",
  placeholder = "Enter your email",
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setMessage("");

    // Simple mock validation
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    // Mock API call
    console.log("Subscribing with:", email);
    setStatus("success");
    setMessage("✅ Thanks for subscribing!");
    setEmail("");

    // Reset status after a few seconds
    setTimeout(() => {
        setStatus("idle");
        setMessage("");
    }, 3000);
  };

  return (
    <section className="w-full bg-gray-900 py-20 px-6 md:px-12 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center">
        {/* Animated Heading */}
        <motion.h2
          variants={fadeIn("down", 0.2) as any}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg"
        >
          {title}
        </motion.h2>
        <motion.p
          variants={fadeIn("down", 0.4) as any}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="mt-4 text-gray-300 max-w-xl mx-auto"
        >
          {description}
        </motion.p>

        {/* Animated Form */}
        <motion.form
          variants={fadeIn("up", 0.6) as any}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 max-w-lg mx-auto"
          noValidate
        >
          <label htmlFor="email-input" className="sr-only">
            Email address
          </label>
          <div className="relative w-full sm:flex-1">
            <input
              id="email-input"
              type="email"
              value={email}
              placeholder={placeholder}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={status === "error"}
              aria-describedby="email-error"
              className={`w-full px-5 py-3 rounded-lg border-2 transition-colors duration-300 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                status === "error"
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-700 focus:ring-cyan-500"
              }`}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full sm:w-auto bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-cyan-700 transform transition-all duration-300 ease-in-out"
          >
            {buttonText}
          </motion.button>
        </motion.form>

        {/* Animated Status Messages */}
        <AnimatePresence>
          {message && (
            <motion.p
              id="email-error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 font-medium ${
                status === "error" ? "text-red-400" : "text-green-400"
              }`}
              aria-live="polite"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default NewsletterCTA;

