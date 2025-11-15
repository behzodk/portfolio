"use client"

import type React from "react"

import { useState } from "react"
import type { FormEvent } from "react"
import { Mail, Linkedin, Github, Instagram, Send, CheckCircle } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { CopyButton } from "@/components/ui/copy-button"

interface FormData {
  name: string
  email: string
  reason: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    reason: "general",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true)
      setIsLoading(false)
      setFormData({ name: "", email: "", reason: "general", message: "" })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <section className="pt-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Have a question or want to collaborate? I'd love to hear from you. Reach out and let's connect.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <AnimatedSection className="lg:col-span-2">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Send me a message</h2>

                {submitted && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-400">Message sent successfully!</p>
                      <p className="text-sm text-green-600 dark:text-green-500">I'll get back to you soon.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border bg-background transition-colors ${
                        errors.name ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                      } focus:outline-none`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border bg-background transition-colors ${
                        errors.email ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                      } focus:outline-none`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Reason */}
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium mb-2">
                      Reason for Contact
                    </label>
                    <select
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="opportunity">Job Opportunity</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-4 py-2 rounded-lg border bg-background transition-colors resize-none ${
                        errors.message ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                      } focus:outline-none`}
                      placeholder="Your message here..."
                    />
                    {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-medium flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>

                {/* Formspree Note */}
                <p className="text-sm text-muted-foreground">
                  This form is ready to be connected to Formspree or your preferred email service. Currently showing
                  client-side validation.
                </p>
              </div>
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection delay={0.1}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Other Ways to Connect</h3>
                  <p className="text-muted-foreground mb-6">
                    Feel free to reach out through any of these channels. I'm always happy to connect and discuss
                    opportunities.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                    <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">Email</h4>
                      <p className="text-sm text-muted-foreground mb-3">contact@behzod.uk</p>
                      <CopyButton text="contact@behzod.uk" label="Copy Email" className="w-full justify-center" />
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                    <Github className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">GitHub</h4>
                      <p className="text-sm text-muted-foreground mb-3">github.com/behzodk</p>
                      <CopyButton
                        text="https://github.com/behzodk"
                        label="Copy GitHub"
                        className="w-full justify-center"
                      />
                    </div>
                  </div>
                </div>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/behzodmusurmonqulov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors group"
                >
                  <Linkedin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">LinkedIn</h4>
                    <p className="text-sm text-muted-foreground">Connect with me</p>
                  </div>
                </a>

                <a
                  href="https://instagram.com/behzod.mv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors group"
                >
                  <Instagram className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">Instagram</h4>
                    <p className="text-sm text-muted-foreground">Follow for updates</p>
                  </div>
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
