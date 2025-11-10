// src/app/portfolio/page.tsx
"use client"

import { useState, useMemo } from "react"
import { X, ExternalLink, Github } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder"
import { ShareSheet } from "@/components/ui/share-sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { projects } from "@/lib/data"

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null)

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category))
    return Array.from(cats)
  }, [])

  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return projects
    return projects.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  const shareUrl = useMemo(() => {
    const path = `/portfolio${selectedProject ? `#${selectedProject.id}` : ""}`
    if (typeof window === "undefined") return path
    try {
      return new URL(path, window.location.origin).toString()
    } catch {
      return path
    }
  }, [selectedProject])

  return (
    <TooltipProvider delayDuration={200}>
      <div className="w-full">
        {/* Header */}
        <section className="pt-5 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <h1 className="text-5xl font-bold mb-4">Portfolio</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                A collection of projects showcasing my expertise in AI, machine learning, and full-stack development.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Filters */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  All Projects
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <AnimatedSection key={project.id} delay={index * 0.05}>
                  <button onClick={() => setSelectedProject(project)} className="group cursor-pointer h-full text-left">
                    <div className="relative h-64 rounded-lg overflow-hidden mb-4 bg-muted flex items-center justify-center">
                      <ImageWithPlaceholder
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        width={400}
                        height={300}
                        className="object-contain w-auto h-full mx-auto transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{project.shortDescription}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 flex justify-between items-center p-6 border-b border-border bg-background">
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Image */}
                <div className="relative h-64 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <ImageWithPlaceholder
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.title}
                    width={600}
                    height={400}
                    className="object-contain w-auto h-full mx-auto"
                  />
                </div>

                {/* Problem */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Problem</h3>
                  <p className="text-muted-foreground">{selectedProject.problem}</p>
                </div>

                {/* Solution */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Solution</h3>
                  <p className="text-muted-foreground">{selectedProject.solution}</p>
                </div>

                {/* Impact */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Impact</h3>
                  <p className="text-muted-foreground">{selectedProject.impact}</p>
                </div>

                {/* Role & Stack */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Role</h3>
                    <p className="text-muted-foreground">{selectedProject.role}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.stack.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-muted rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex gap-4">
                    {/* Live */}
                    <a
                      href={selectedProject.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full flex-1 items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-center font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live
                    </a>

                    {/* GitHub: disabled + tooltip when empty */}
                    {(() => {
                      const githubUrl = selectedProject.links?.github?.trim?.() || ""
                      const hasGithub = githubUrl.length > 0

                      const baseClasses =
                        "flex w-full flex-1 items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg transition-colors text-center font-medium"

                      return (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={hasGithub ? githubUrl : undefined}
                              target={hasGithub ? "_blank" : undefined}
                              rel={hasGithub ? "noopener noreferrer" : undefined}
                              onClick={(e) => {
                                if (!hasGithub) e.preventDefault()
                              }}
                              aria-disabled={!hasGithub}
                              className={`${baseClasses} ${
                                hasGithub ? "hover:bg-muted" : "cursor-not-allowed opacity-50"
                              }`}
                            >
                              <Github className="w-4 h-4" />
                              GitHub
                            </a>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            {hasGithub ? "View source on GitHub" : "This repository is private"}
                          </TooltipContent>
                        </Tooltip>
                      )
                    })()}
                  </div>

                  <ShareSheet url={shareUrl} title={selectedProject.title} description={selectedProject.shortDescription} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
