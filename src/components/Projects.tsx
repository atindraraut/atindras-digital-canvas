import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "MapMyMoments - AI Travel Planning Platform",
      description: "Built an intelligent travel planning platform enabling collaborative route creation with AI-powered photo organization and real-time sharing capabilities. Supports 1,000+ concurrent users with 99.9% uptime.",
      technologies: ["React", "TypeScript", "Go", "MongoDB", "AWS S3", "Claude AI", "Google Places API"],
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
      github: "#",
      live: "#",
      featured: true
    },
    {
      title: "Infrastructure Automation System",
      description: "Developed comprehensive Terraform scripts for streamlined deployment of Nginx, applications, and databases, reducing setup time by 80% with one-click environment management.",
      technologies: ["Terraform", "AWS", "Docker", "Nginx", "CI/CD", "GitHub Actions"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
      github: "#",
      live: "#",
      featured: true
    },
    {
      title: "Hybrid Serverless Architecture",
      description: "Implemented hybrid serverless/server architecture using AWS Lambda and Step Functions, reducing infrastructure costs by 70% while maintaining high availability.",
      technologies: ["AWS Lambda", "Step Functions", "Node.js", "Serverless", "CloudWatch"],
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
      github: "#",
      live: "#",
      featured: false
    },
    {
      title: "B2B Credit Management System",
      description: "Contributed to platform development implementing ML-based credit risk prediction features and RESTful APIs, improving team productivity by 40%.",
      technologies: ["Spring Boot", "Java", "Machine Learning", "REST APIs", "Microservices"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      github: "#",
      live: "#",
      featured: false
    }
  ];

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and passion projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={project.title}
              className={`glass-card overflow-hidden hover:glow-effect smooth-transition animate-fade-up border-border/50 group ${
                project.featured ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 smooth-transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" className="smooth-transition hover:border-primary hover:text-primary">
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                  <Button size="sm" className="smooth-transition hover:glow-effect">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Projects;