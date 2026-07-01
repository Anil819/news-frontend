import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import api from "../api/axios";

const info = [
  {
    icon: MapPin,
    label: "Address",
    value: "Sector B, Gumasta Nagar, Scheme 71, Indore, Madhya Pradesh 452009",
  },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: Mail, label: "Email", value: "Svims@college.edu.in" },
  { icon: Clock, label: "Office Hours", value: "Mon - Sat: 9:00 AM - 6:00 PM" },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not send your message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Breadcrumb title="Get In Touch" trail={[{ label: "Contact" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
        {/* Info + Map */}
        <div className="space-y-5">
          <div className="space-y-5">
            {info.map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4"
              >
                <div className="bg-blue-50 text-blue-600 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {item.label}
                  </h4>
                  <p className="text-sm text-gray-500 mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Our Location</h3>
              <p className="text-sm text-gray-500 mt-1">
                Find us on the map and plan your visit to our college campus.
              </p>
            </div>
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.0633599974985!2d75.82976507534819!3d22.701371979400268!2m3!1f0!3f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fdb5a5632205%3A0x621eb50b8e53e1b3!2sShri%20Vaishnav%20Institute%20of%20Management%20%26%20Science%2C%20Indore!5e1!3m2!1sen!2sin!4v1782925609626!5m2!1sen!2sin"
  width="100%"
  height="400"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="strict-origin-when-cross-origin"
  title="Shri Vaishnav Institute of Management & Science"
></iframe>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4"
        >
          {sent && (
            <div className="bg-green-50 text-green-700 text-sm px-4 py-2.5 rounded-lg">
              Your message has been sent. We'll get back to you soon.
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your Name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Your Email"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="Subject"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Your Message"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors"
          >
            {submitting ? "Sending..." : "Send Message"} <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
