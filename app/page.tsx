// src/app/page.tsx
"use client"

import Link from "next/link"
import { ArrowRight, Github, Linkedin, Mail, Sparkles, Brain, Code, Database, Wrench } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import type { Variants } from "framer-motion"
import { ReactNode } from "react"
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder"
import { projects, blogPosts, skills } from "@/lib/data"
import { AnimatedBackground } from "@/components/hero/animated-background"
import { FloatingElements } from "@/components/hero/floating-elements"
import { CodeSnippets } from "@/components/hero/code-snippets"
import { SkillCard } from "@/components/skills/skill-card"
import { TypingAnimation } from "@/components/hero/typing-animation"

// ---- Reusable Animation Components (typed) ----

type AnimatedSectionProps = {
  children: ReactNode
  delay?: number
}

const AnimatedSection = ({ children }: AnimatedSectionProps) => {
  return <div>{children}</div>
}

type StaggeredTextProps = {
  text: string
  className: string
}

const StaggeredText = ({ text, className }: StaggeredTextProps) => {
  const letters = Array.from(text)

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  }

  const child: Variants = {
    hidden: { opacity: 0, y: 20, transition: { type: "spring", damping: 12, stiffness: 100 } },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
  }

  return (
    <motion.h1 className={className} variants={container} initial="hidden" animate="visible" aria-label={text}>
      {letters.map((l, i) => (
        <motion.span key={i} variants={child} style={{ display: "inline-block" }}>
          {l === " " ? "\u00A0" : l}
        </motion.span>
      ))}
    </motion.h1>
  )
}

type SocialLink = {
  href: string
  icon: LucideIcon
  label: string
  ext: boolean
}

// ---- Page ----
export default function Home() {
  const prefersReducedMotion = useReducedMotion()

  const socialLinks: SocialLink[] = [
    { href: "https://github.com/behzodk", icon: Github, label: "GitHub", ext: true },
    { href: "https://www.linkedin.com/in/behzodmusurmonqulov/", icon: Linkedin, label: "LinkedIn", ext: true },
    { href: "mailto:behzodmusurmonqulov@gmail.com", icon: Mail, label: "Email", ext: false },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {!prefersReducedMotion && (
          <>
            <AnimatedBackground />
            <FloatingElements />
            <CodeSnippets />
          </>
        )}

        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-accent/10" />

        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Available for volunteering</span>
          </motion.div>

          {/* Name + subheadline */}
          <div className="space-y-6">
            <TypingAnimation
              text="Behzod Musurmonkulov"
              className="text-4xl sm:text-6xl lg:text-6xl font-bold tracking-tight text-balance leading-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
              delay={0.4}
              speed={0.08}
              gradient
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100, delay: 2.2 }}
            >
              <p className="text-xl sm:text-xl lg:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
                AI + CS @ University of Birmingham. A quiet record of what I’m learning, noticing, and changing my mind
                about, slowly and on purpose.
              </p>
            </motion.div>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 2.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
              <Link
                href="/portfolio"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all font-semibold text-lg"
              >
                View Work
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-border rounded-xl hover:bg-muted hover:border-primary/50 transition-all font-semibold text-lg backdrop-blur-sm"
              >
                Get in Touch
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Social chips */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 3 }} className="flex justify-center gap-6 pt-6">
            {socialLinks.map(({ href, icon: Icon, label, ext }, index) => (
              <motion.a
                key={label}
                href={href}
                target={ext ? "_blank" : undefined}
                rel={ext ? "noopener noreferrer" : undefined}
                className="group relative p-3 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors duration:200"
                aria-label={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 150, delay: 3 + index * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className=" px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <br />
            <br />
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Showcasing my latest work in AI and software development
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {projects.slice(0, 2).map((project, index) => (
              <AnimatedSection key={project.id} delay={index * 0.1}>
                <Link href={`/portfolio#project-${project.id}`}>
                  <motion.div
                    className="group cursor-pointer h-full bg-card rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border/50 overflow-hidden"
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className="relative h-64 overflow-hidden bg-muted">
                      <ImageWithPlaceholder
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        width={500}
                        height={300}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-muted-foreground mb-4">{project.shortDescription}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="text-center">
              <Link href="/portfolio" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium group">
                View All Projects <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <br />
          </AnimatedSection>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Technical Expertise</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Skills & Stack
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A comprehensive toolkit for building intelligent systems and scalable applications
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkillCard
              category="Machine Learning"
              skills={skills["Machine Learning"]}
              icon={Brain}
              gradient="bg-gradient-to-br from-purple-500 to-pink-500"
            />
            <SkillCard
              category="Web Development"
              skills={skills["Web Development"]}
              icon={Code}
              gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
            />
            <SkillCard
              category="Data Science"
              skills={skills["Data Science"]}
              icon={Database}
              gradient="bg-gradient-to-br from-green-500 to-emerald-500"
            />
            <SkillCard
              category="Tools & Platforms"
              skills={skills["Tools & Platforms"]}
              icon={Wrench}
              gradient="bg-gradient-to-br from-orange-500 to-red-500"
            />
          </div>

          <AnimatedSection delay={0.4}>
            <div className="text-center mt-12">
              <p className="text-muted-foreground">
                Always learning and exploring new technologies.{" "}
                <Link href="/about" className="text-primary hover:underline font-medium">
                  Learn more about my journey
                </Link>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative h-96 rounded-lg overflow-hidden ring-1 ring-black/5 shadow-2xl">
                <ImageWithPlaceholder src="/professional-portrait.jpg" alt="Behzod Musurmonkulov" width={400} height={400} priority />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                <h2 className="text-4xl font-bold">About Me</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I'm a passionate AI and Computer Science student with a focus on building intelligent systems that solve real-world problems. With experience in machine learning, full-stack development, and research, I'm committed to pushing the boundaries of what's possible with technology.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  When I'm not coding or researching, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the community.
                </p>
                <Link href="/about" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium group">
                  Read Full Bio <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <br />
            <br />
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Latest Articles</h2>
              <p className="text-lg text-muted-foreground">Thoughts on AI, technology, and software engineering</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {blogPosts.slice(0, 3).map((post, index) => (
              <AnimatedSection key={post.id} delay={index * 0.05}>
                <Link href={`/blog/${post.slug}`}>
                  <motion.article
                    className="group cursor-pointer h-full flex flex-col bg-card rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border/50 overflow-hidden"
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <ImageWithPlaceholder
                        src={post.cover || "/placeholder.svg"}
                        alt={post.title}
                        width={400}
                        height={200}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <time className="text-sm text-muted-foreground mb-2">
                        {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </time>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors flex-1">{post.title}</h3>
                      <p className="text-muted-foreground mb-4">{post.summary}</p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-muted rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="text-center">
              <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium group">
                Read All Articles <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
