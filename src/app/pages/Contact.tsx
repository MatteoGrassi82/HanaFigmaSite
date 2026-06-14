import { motion } from "motion/react";
import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { SEO } from "../components/SEO";
import { breadcrumbSchema } from "../components/SEO";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;

    try {
      // Delivers the enquiry by email to matteo@usehana.com via FormSubmit (no API key
      // required). After the one-time activation email, swap the address for FormSubmit's
      // hashed alias so the inbox isn't exposed in client code.
      const response = await fetch("https://formsubmit.co/ajax/matteo@usehana.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (!response.ok) throw new Error("Request failed");

      toast.success("Message sent", {
        description: "Thanks for reaching out — we'll get back to you shortly.",
      });
      form.reset();
    } catch {
      toast.error("Couldn't send your message", {
        description: "Please email us directly at hello@hana.health.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO 
        title="Contact Us"
        description="Get in touch with the Hana Voice AI team. Schedule a demo, ask about our clinical agents, or discuss partnership opportunities."
        path="/contact"
        keywords="contact Hana Health, schedule AI demo, healthcare AI partnership, clinical voice AI inquiry, book demo"
        jsonLd={breadcrumbSchema([
          { name: "Home", url: "https://www.hana.health/" },
          { name: "Contact", url: "https://www.hana.health/contact" }
        ])}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 dark:text-white mb-6">
            Get in touch
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have questions about our clinical AI agents? We're here to help you transform your healthcare workflows.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8 md:space-y-12"
          >
            <div>
              <h3 className="text-2xl font-medium text-slate-900 dark:text-white mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">Email</h4>
                    <p className="text-slate-600 dark:text-slate-400">hello@hana.health</p>
                    <p className="text-slate-600 dark:text-slate-400">support@hana.health</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">Office</h4>
                    {/* TODO: insert real registered business address (needed as the GDPR/CCPA controller address) */}
                    <p className="text-slate-600 dark:text-slate-400">
                      HANA Health, Inc.<br />
                      Remote-first team
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 md:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Ready to get started?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Skip the queue and schedule a direct demo with our product specialists.
              </p>
              <a href="https://calendly.com/matteowastaken/discoverycall" target="_blank" rel="noopener noreferrer" className="w-full py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-opacity block text-center">
                Book a Live Demo
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-medium text-slate-900 dark:text-white mb-6">
                Send us a message
              </h3>
              
              <div className="space-y-6">
                {/* FormSubmit configuration (hidden) */}
                <input type="hidden" name="_subject" value="New enquiry from hana.health" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="First Name"
                      required
                      className="w-full px-4 py-3 text-base rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="Last Name"
                      required
                      className="w-full px-4 py-3 text-base rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 text-base rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="jane@organization.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="Subject"
                    className="w-full px-4 py-3 text-base rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option>Sales Inquiry</option>
                    <option>Technical Support</option>
                    <option>Partnership Opportunity</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="Message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 text-base rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us about your organization's needs..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-500 dark:text-slate-500 mt-4 text-center">
                  By submitting this form you agree to our{" "}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}