import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Skills = () => {
  const skills = [
    {
      category: "Languages",
      technologies: [
        { name: "JavaScript (Node.js)", level: "Expert", icon: "" },
        { name: "Python", level: "Advanced", icon: "" },
        { name: "Java", level: "Advanced", icon: "" },
        { name: "SQL", level: "Advanced", icon: "" },
        { name: "Go", level: "Intermediate", icon: "" },
      ]
    },
    {
      category: "Frontend & Frameworks",
      technologies: [
        { name: "React", level: "Expert", icon: "" },
        { name: "TypeScript", level: "Advanced", icon: "" },
        { name: "Spring Boot", level: "Advanced", icon: "" },
        { name: "Node.js", level: "Expert", icon: "" },
        { name: "Kafka", level: "Advanced", icon: "" },
      ]
    },
    {
      category: "Cloud & DevOps",
      technologies: [
        { name: "AWS", level: "Expert", icon: "☁️" },
        { name: "Terraform", level: "Advanced", icon: "🏗️" },
        { name: "Docker", level: "Advanced", icon: "🐳" },
        { name: "Linux", level: "Advanced", icon: "🐧" },
        { name: "Nginx", level: "Advanced", icon: "🌐" },
      ]
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert": return "text-green-400";
      case "Advanced": return "text-blue-400";
      case "Intermediate": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Skills & <span className="text-gradient">Technologies</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crafting exceptional digital solutions with modern technologies and best practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skillGroup, index) => (
            <Card 
              key={skillGroup.category} 
              className="glass-card p-6 hover:glow-effect smooth-transition animate-fade-up border-border/50"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-primary">
                {skillGroup.category}
              </h3>
              
              <div className="space-y-4">
                {skillGroup.technologies.map((tech) => (
                  <div key={tech.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{tech.icon}</span>
                      <span className="font-medium">{tech.name}</span>
                    </div>
                    <span className={`text-sm font-medium ${getLevelColor(tech.level)}`}>
                      {tech.level}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Also experienced with section */}
        <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-xl font-semibold mb-6 text-foreground">Also experienced with</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              "Git", "GitHub Actions", "RESTful APIs", "CI/CD", "Microservices", 
              "Event-driven Architecture", "AWS Lambda", "Step Functions", "Confluent Kafka", 
              "MongoDB", "AWS S3", "CloudFront", "JWT Authentication", "Google OAuth", "Redis"
            ].map((tech) => (
              <Badge 
                key={tech} 
                variant="outline" 
                className="px-4 py-2 hover:bg-primary/20 hover:border-primary smooth-transition cursor-default"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;