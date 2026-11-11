import React, { useState } from "react";
import {
  Mail,
  Building,
  User,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";

interface FormState {
  name: string;
  email: string;
  company: string;
  tier: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
}

export default function Contact() {
  const { navigate } = useNavigation();

  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    tier: "Professional (₹999/mo)",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormState | null>(null);

  const validate = (data: FormState): FormErrors => {
    const errs: FormErrors = {};

    if (!data.name.trim()) {
      errs.name = "Full name is required";
    } else if (data.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters long";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errs.email = "Work email is required";
    } else if (!emailRegex.test(data.email.trim())) {
      errs.email = "Please enter a valid work email address";
    }

    if (!data.company.trim()) {
      errs.company = "Company name is required";
    } else if (data.company.trim().length < 2) {
      errs.company = "Company name must be at least 2 characters long";
    }

    if (!data.message.trim()) {
      errs.message = "Message is required";
    } else if (data.message.trim().length < 10) {
      errs.message = "Please provide at least 10 characters describing your inquiry";
    }

    return errs;
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate(formData);
    setErrors(validationErrors);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (touched[field]) {
      const validationErrors = validate(updated);
      setErrors(validationErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all touched
    setTouched({
      name: true,
      email: true,
      company: true,
      message: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // Realistic simulation of client-side request dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setSubmittedData({ ...formData });
      setFormData({
        name: "",
        email: "",
        company: "",
        tier: "Professional (₹999/mo)",
        message: "",
      });
      setTouched({});
      setErrors({});
    }, 700);
  };

  return (
    <section id="contact" className="py-24 bg-[#0a0f1d] relative overflow-hidden border-t border-white/[0.08]">
      {/* Glow decorations */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-blue-600/10 blur-[160px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Enterprise Channel</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Schedule a Demo & Connect.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Have questions about BizPro&apos;s architecture or want a custom walkthrough? Submit your details below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
          {/* LEFT: Contact Information & SLAs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-2">Enterprise Engagement</h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                Connect directly with our engineering and operations team for architecture reviews, deterministic data models, or customized team deployments.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Inquiry & Support Email</div>
                    <div className="text-sm font-semibold text-white font-mono">mk3631780@gmail.com</div>
                    <div className="text-[11px] text-slate-400">Direct response channel</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Response SLA</div>
                    <div className="text-sm font-semibold text-white">&lt; 2 Hours Guaranteed</div>
                    <div className="text-[11px] text-slate-400">Mon – Sat, 9:00 AM – 7:00 PM IST</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Development Office</div>
                    <div className="text-sm font-semibold text-white">Bangalore, Karnataka, India</div>
                    <div className="text-[11px] text-slate-400">Sankar Group Assignment Base</div>
                  </div>
                </div>
              </div>

              {/* Direct App Link */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <div className="text-xs text-slate-400 mb-2">Want immediate evaluation?</div>
                <button
                  type="button"
                  onClick={() => navigate("/app")}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 border border-blue-500/25 transition-all"
                >
                  <span>Launch Live Dashboard Directly</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Privacy Promise */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs text-slate-400">
                <span className="text-white font-medium">Privacy Guaranteed:</span> We never sell contact information or deploy third-party advertising cookies.
              </div>
            </div>
          </div>

          {/* RIGHT: Interactive Contact / Demo Request Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-2xl bg-[#0f172a] border border-white/[0.12] shadow-2xl shadow-black/60 relative">
              {/* SUCCESS NOTIFICATION */}
              {isSuccess && submittedData ? (
                <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Demo Request Received!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{submittedData.name}</strong>. Our enterprise team will follow up at <span className="text-blue-400 font-mono text-xs">{submittedData.email}</span> within 2 hours.
                  </p>

                  <div className="max-w-md mx-auto p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left text-xs space-y-1.5 text-slate-300">
                    <div><strong>Company:</strong> {submittedData.company}</div>
                    <div><strong>Selected Tier:</strong> {submittedData.tier}</div>
                    <div><strong>Message Preview:</strong> &quot;{submittedData.message}&quot;</div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.05] border border-white/[0.08] transition-colors"
                    >
                      Send Another Inquiry
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/app")}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <span>Explore Live App</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* FORM INPUTS */
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="border-b border-white/[0.06] pb-4 mb-2">
                    <h3 className="text-lg font-bold text-white">Request Product Demo</h3>
                    <p className="text-xs text-slate-400">Please provide your details below. All fields are validated client-side.</p>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/[0.03] border text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          touched.name && errors.name
                            ? "border-rose-500 focus:border-rose-500"
                            : "border-white/[0.1] focus:border-blue-500"
                        }`}
                        aria-invalid={!!(touched.name && errors.name)}
                        aria-describedby={touched.name && errors.name ? "name-error" : undefined}
                      />
                    </div>
                    {touched.name && errors.name && (
                      <p id="name-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email & Company Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Input */}
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Work Email <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="contact-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          onBlur={() => handleBlur("email")}
                          placeholder="rahul@company.com"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/[0.03] border text-white placeholder-slate-500 focus:outline-none transition-colors ${
                            touched.email && errors.email
                              ? "border-rose-500 focus:border-rose-500"
                              : "border-white/[0.1] focus:border-blue-500"
                          }`}
                          aria-invalid={!!(touched.email && errors.email)}
                          aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                        />
                      </div>
                      {touched.email && errors.email && (
                        <p id="email-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Company Input */}
                    <div>
                      <label htmlFor="contact-company" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Company Name <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Building className="w-4 h-4" />
                        </div>
                        <input
                          id="contact-company"
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleChange("company", e.target.value)}
                          onBlur={() => handleBlur("company")}
                          placeholder="Acme Enterprise"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/[0.03] border text-white placeholder-slate-500 focus:outline-none transition-colors ${
                            touched.company && errors.company
                              ? "border-rose-500 focus:border-rose-500"
                              : "border-white/[0.1] focus:border-blue-500"
                          }`}
                          aria-invalid={!!(touched.company && errors.company)}
                          aria-describedby={touched.company && errors.company ? "company-error" : undefined}
                        />
                      </div>
                      {touched.company && errors.company && (
                        <p id="company-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.company}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div>
                    <label htmlFor="contact-tier" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Interested In Plan / Tier
                    </label>
                    <select
                      id="contact-tier"
                      value={formData.tier}
                      onChange={(e) => handleChange("tier", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#080d1a] border border-white/[0.1] text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Professional (₹999/mo)">Professional Tier (₹999/month, Illustrative)</option>
                      <option value="Starter (Free)">Starter Tier (Free)</option>
                      <option value="Custom Enterprise">Custom Enterprise Deployment</option>
                      <option value="General Inquiry">General Product Inquiry</option>
                    </select>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Message / Use Case <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        onBlur={() => handleBlur("message")}
                        placeholder="Tell us about your team size, key analytics challenges, and what you would like to explore during the demo..."
                        className={`w-full p-3.5 rounded-xl text-sm bg-white/[0.03] border text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          touched.message && errors.message
                            ? "border-rose-500 focus:border-rose-500"
                            : "border-white/[0.1] focus:border-blue-500"
                        }`}
                        aria-invalid={!!(touched.message && errors.message)}
                        aria-describedby={touched.message && errors.message ? "message-error" : undefined}
                      />
                    </div>
                    {touched.message && errors.message && (
                      <p id="message-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Validating & Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Demo Request</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

