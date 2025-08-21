import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Calendar } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      title: "Software Development Engineer",
      company: "Neoscript.in",
      companyUrl: "https://neoscript.in/",
      location: "Bengaluru, IN",
      period: "Jan 2023 – Present",
      type: "Full-time",
      highlights: [
        "Infrastructure Automation: Developed comprehensive Terraform scripts for streamlined deployment of Nginx, applications, and databases, enabling one-click environment management and reducing setup time by 80%",
        "System Architecture: Implemented hybrid serverless/server architecture using AWS Lambda and Step Functions, reducing infrastructure costs by 70% while maintaining high availability",
        "Development Pipeline: Established robust CI/CD pipelines with GitHub Actions, incorporating automated testing and security scans, improving deployment reliability by 45%",
        "Data Systems: Architected event-driven data flow using Confluent Kafka and AWS services, ensuring data consistency across multiple databases and microservices"
      ],
      technologies: ["Terraform", "AWS Lambda", "Step Functions", "GitHub Actions", "Kafka", "Microservices", "Node.js"]
    },
    {
      title: "Associate Software Engineer-1", 
      company: "HighRadius Technologies Pvt Ltd",
      companyUrl: "https://www.highradius.com/",
      location: "Bhubaneswar, IN",
      period: "July 2021 – November 2022",
      type: "Full-time",
      highlights: [
        "Platform Development: Contributed to B2B Credit Management System development, implementing ML-based credit risk prediction features and RESTful APIs",
        "Developer Tools: Built and maintained developer tools and integration libraries, improving team productivity by 40%"
      ],
      technologies: ["Spring Boot", "Java", "Machine Learning", "REST APIs", "B2B Systems"]
    }
  ];

  const education = {
    degree: "Bachelor of Technology in Electrical and Electronics",
    university: "GIET University",
    universityUrl: "https://www.giet.edu/",
    location: "Gunupur, IN", 
    period: "July 2018 – May 2022"
  };

  const certifications = [
    {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "Dec 2023",
      categories: ["Cloud Development", "AWS Services"],
      credlyUrl: "https://www.credly.com/badges/a98b3401-f620-4083-afa4-e4b8001d2f1d/public_url"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Experience & <span className="text-gradient">Background</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            3+ years of experience building scalable web applications and distributed systems
          </p>
        </div>

        {/* Experience */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-foreground">Professional Experience</h3>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card 
                key={`${exp.company}-${exp.title}`}
                className="glass-card p-6 hover:glow-effect smooth-transition animate-fade-up border-border/50"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <h4 className="text-xl font-semibold text-foreground mb-2">{exp.title}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <a 
                          href={exp.companyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium hover:text-primary smooth-transition"
                        >
                          {exp.company}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="whitespace-nowrap">{exp.period}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-muted-foreground leading-relaxed">
                        • {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <Badge 
                      key={tech}
                      variant="outline" 
                      className="px-3 py-1 hover:bg-primary/20 hover:border-primary smooth-transition cursor-default"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education */}
          <Card className="glass-card p-6 animate-fade-up border-border/50" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-semibold mb-4 text-primary">Education</h3>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">{education.degree}</h4>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="w-4 h-4" />
                <a 
                  href={education.universityUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary smooth-transition"
                >
                  {education.university}
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{education.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{education.period}</span>
              </div>
            </div>
          </Card>

          {/* Certifications */}
          <Card className="glass-card p-6 animate-fade-up border-border/50" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-xl font-semibold mb-4 text-primary">Certifications</h3>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="space-y-2">
                  <a 
                    href={cert.credlyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block hover:text-primary smooth-transition"
                  >
                    <h4 className="font-medium text-foreground hover:text-primary">{cert.name}</h4>
                  </a>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{cert.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cert.categories.map((category) => (
                      <Badge 
                        key={category}
                        variant="secondary" 
                        className="text-xs px-2 py-1"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Experience;