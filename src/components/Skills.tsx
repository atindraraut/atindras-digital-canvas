import { Card } from "@/components/ui/card";

const Skills = () => {
  const skills = [
    {
      category: "Frontend",
      technologies: [
        { name: "React.js", level: "Expert", icon: "⚛️" },
        { name: "TypeScript", level: "Advanced", icon: "📘" },
        { name: "Next.js", level: "Advanced", icon: "▲" },
        { name: "Tailwind CSS", level: "Expert", icon: "🎨" },
        { name: "JavaScript ES6+", level: "Expert", icon: "💛" },
      ]
    },
    {
      category: "Backend",
      technologies: [
        { name: "Node.js", level: "Expert", icon: "🟢" },
        { name: "Express.js", level: "Advanced", icon: "🚂" },
        { name: "GraphQL", level: "Intermediate", icon: "🔷" },
        { name: "REST APIs", level: "Expert", icon: "🌐" },
        { name: "MongoDB", level: "Advanced", icon: "🍃" },
      ]
    },
    {
      category: "Cloud & DevOps",
      technologies: [
        { name: "AWS", level: "Advanced", icon: "☁️" },
        { name: "Docker", level: "Intermediate", icon: "🐳" },
        { name: "CI/CD", level: "Advanced", icon: "🔄" },
        { name: "Lambda", level: "Advanced", icon: "λ" },
        { name: "S3 & CloudFront", level: "Expert", icon: "📦" },
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
      </div>
    </section>
  );
};

export default Skills;