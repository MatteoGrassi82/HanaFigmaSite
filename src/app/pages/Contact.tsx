import { motion } from "motion/react";
import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { SEO } from "../components/SEO";
import { breadcrumbSchema } from "../components/SEO";
import { useTranslations } from "../../lib/i18n";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      firstName: fd.get("First Name"),
      lastName: fd.get("Last Name"),
      email: fd.get("email"),
      subject: fd.get("Subject"),
      message: fd.get("Message"),
      honey: fd.get("honey"),
    };

    try {
      // Posts to our Vercel serverless function (api/contact.ts), which sends the
      // enquiry by email via Resend to matteo@usehana.com. The API key stays server-side.
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Request failed");

      toast.success(t.contact.successTitle, {
        description: t.contact.successBody,
      });
      form.reset();
    } catch {
      toast.error(t.contact.errorTitle, {
        description: t.contact.errorBody,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO
        title={t.contact.seoTitle}
        useExactTitle={true}
        description={t.contact.seoDescription}
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
            {t.contact.h1}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.contact.subheading}
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
                {t.contact.infoTitle}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">{t.contact.emailLabel}</h4>
                    <p className="text-slate-600 dark:text-slate-400">hello@hana.health</p>
                    <p className="text-slate-600 dark:text-slate-400">support@hana.health</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">{t.contact.officeLabel}</h4>
                    {/* TODO: insert real registered business address (needed as the GDPR/CCPA controller address) */}
                    <p className="text-slate-600 dark:text-slate-400">
                      {t.contact.officeCompany}<br />
                      {t.contact.officeNote}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 md:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                {t.contact.getStartedTitle}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {t.contact.getStartedBody}
              </p>
              <a href="https://calendly.com/matteowastaken/discoverycall" target="_blank" rel="noopener noreferrer" className="w-full py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-opacity block text-center">
                {t.contact.bookDemo}
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
                {t.contact.formTitle}
              </h3>
              
              <div className="space-y-6">
                {/* Honeypot spam trap (humans never fill this) */}
                <input type="text" name="honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t.contact.firstNameLabel}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="First Name"
                      required
                      className="w-full px-4 py-3 text-base rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder={t.contact.firstNamePlaceholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t.contact.lastNameLabel}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="Last Name"
                      required
                      className="w-full px-4 py-3 text-base rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder={t.contact.lastNamePlaceholder}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.contact.emailAddress}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 text-base rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder={t.contact.emailPlaceholder}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.contact.subjectLabel}
                  </label>
                  <select
                    id="subject"
                    name="Subject"
                    className="w-full px-4 py-3 text-base rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option>{t.contact.subjectSales}</option>
                    <option>{t.contact.subjectSupport}</option>
                    <option>{t.contact.subjectPartnership}</option>
                    <option>{t.contact.subjectOther}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="Message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 text-base rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    t.contact.submittingButton
                  ) : (
                    <>
                      {t.contact.submitButton}
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-500 dark:text-slate-500 mt-4 text-center">
                  {t.contact.privacyNote.split(/Privacy Policy|Informativa Privacy/)[0]}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    {t.contact.subjectOther === "Altro" ? "Informativa Privacy" : "Privacy Policy"}
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