"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Loader2, Check, Clock, MapPin } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact MenuStudio",
  description: "Get in touch with the MenuStudio team for support, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setSent(true);
      } else {
        setError(d.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="mt-2 text-white/50">
            Questions, feedback, or partnership ideas — we&apos;d love to hear from you
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 md:col-span-2"
          >
            <GlassCard level={2} className="p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20">
                <Mail className="h-5 w-5 text-primary-300" />
              </div>
              <h3 className="font-semibold text-white">Email Us</h3>
              <p className="mt-1 text-sm text-white/50">
                <a href="mailto:support@menustudio.app" className="hover:text-primary-300">
                  support@menustudio.app
                </a>
              </p>
            </GlassCard>

            <GlassCard level={2} className="p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20">
                <Clock className="h-5 w-5 text-primary-300" />
              </div>
              <h3 className="font-semibold text-white">Response Time</h3>
              <p className="mt-1 text-sm text-white/50">
                We usually reply within 1–2 business days
              </p>
            </GlassCard>

            <GlassCard level={2} className="p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20">
                <MapPin className="h-5 w-5 text-primary-300" />
              </div>
              <h3 className="font-semibold text-white">MenuStudio</h3>
              <p className="mt-1 text-sm text-white/50">
                A fully remote team serving restaurants worldwide
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="md:col-span-3"
          >
            <GlassCard level={2} className="p-6">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-12 text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <Check className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">Message Sent</h3>
                  <p className="text-sm text-white/50">
                    Thanks for reaching out! We&apos;ll get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary-300" />
                    <h3 className="text-lg font-semibold text-white">Send a Message</h3>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="text-sm text-white/60">Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        minLength={2}
                        maxLength={100}
                        className="glass-input w-full"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-sm text-white/60">Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="glass-input w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="text-sm text-white/60">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="How can we help?"
                      required
                      minLength={2}
                      maxLength={200}
                      className="glass-input w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-sm text-white/60">Message</label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us more (at least 10 characters)…"
                      required
                      minLength={10}
                      maxLength={5000}
                      rows={6}
                      className="glass-input w-full resize-y"
                    />
                  </div>

                  <GlassButton type="submit" variant="primary" disabled={isSending} aria-label="Send contact message">
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Send Message
                  </GlassButton>
                </form>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
