import type { Metadata } from "next"
import { Download } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder"
import { timeline, skills } from "@/lib/data"

export const metadata: Metadata = {
  title: "About | Behzod Musurmonkulov",
  description: "Learn more about Behzod Musurmonkulov, AI & Computer Science Student",
}

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="pt-5 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h1 className="text-5xl font-bold mb-4">About Me</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Passionate about AI, machine learning, and building technology that makes a difference.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative h-96 rounded-lg overflow-hidden">
                <ImageWithPlaceholder
                  src="/professional-portrait.jpg"
                  alt="Behzod Musurmonkulov"
                  width={600}
                  height={1000}
                  priority
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Who I Am</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    I’m Behzod Musurmonkulov, studying AI and computer science at the University of Birmingham. I like 
                    clear problems, plain language, and steady progress. I map a problem before I code, keep names readable, 
                    and change my mind when the evidence is better. I care about simple machine learning systems, thoughtful
                     interfaces, and the logic that sits under good software. I practice calm leadership by setting 
                     direction, breaking work into simple pieces, listening first, and helping people move together with
                      less friction. I enjoy organizing student events and creating environments where people can 
                      contribute without noise.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Away from the screen I am learning Spanish, I play guitar, and I am a mid level Go player who likes
                     long games and patient shapes. I also enjoy football and tennis, and I keep notes to remember what
                      actually works. Most things I share are quiet and practical, focused on understanding a bit more 
                      each time and keeping only the parts that last.
                  </p>
                </div>

                <a
                  href="/CV-Improved.pdf"
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  <Download className="w-4 h-4" /> Download CV
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-16 text-center">Experience & Education</h2>
          </AnimatedSection>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-primary mt-2" />
                    {index < timeline.length - 1 && <div className="w-0.5 h-24 bg-border mt-4" />}
                  </div>
                  <div className="pb-8">
                    <p className="text-sm font-semibold text-primary">{item.year}</p>
                    <h3 className="text-xl font-bold mt-1">{item.title}</h3>
                    <p className="text-muted-foreground font-medium">{item.organization}</p>
                    <p className="text-muted-foreground mt-2">{item.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-16 text-center">Skills & Expertise</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(skills).map(([category, items], index) => (
              <AnimatedSection key={category} delay={index * 0.1}>
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">{category}</h3>
                  <div className="space-y-2">
                    {items.map((skill) => (
                      <div key={skill} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-12 text-center">Awards & Recognition</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Winner of Regional Programming Olympiad",
                organization: "Programming Olympiad of republic of Uzbekistan",
                description: "First place among high school students in the regional programming competition",
              },
              {
                title: "Student of the Year 2024",
                organization: "Agency of Specialized Schools",
                description: "Recognized for outstanding academic performance and community involvement by minister of public education",
              },
            ].map((award, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <h3 className="font-bold text-lg mb-2">{award.title}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{award.organization}</p>
                  <p className="text-muted-foreground text-sm">{award.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
