import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Skills = () => {
  const skillCategories = [
    {
      category: "Frontend Development",
      description: "Building responsive and interactive user interfaces",
      skills: [
        { name: "React.js", level: 95, years: "4+ years", icon: "⚛️" },
        { name: "TypeScript", level: 88, years: "3+ years", icon: "🔷" },
        { name: "Next.js", level: 85, years: "2+ years", icon: "▲" },
        { name: "Tailwind CSS", level: 90, years: "3+ years", icon: "🎨" },
        { name: "JavaScript ES6+", level: 95, years: "5+ years", icon: "💛" },
        { name: "HTML5/CSS3", level: 92, years: "5+ years", icon: "🌐" },
      ]
    },
    {
      category: "Backend Development", 
      description: "Scalable server-side applications and APIs",
      skills: [
        { name: "Node.js", level: 92, years: "4+ years", icon: "🟢" },
        { name: "Express.js", level: 88, years: "3+ years", icon: "🚂" },
        { name: "GraphQL", level: 75, years: "2+ years", icon: "🔷" },
        { name: "REST APIs", level: 95, years: "4+ years", icon: "🌐" },
        { name: "MongoDB", level: 85, years: "3+ years", icon: "🍃" },
        { name: "PostgreSQL", level: 80, years: "2+ years", icon: "🐘" },
      ]
    },
    {
      category: "Cloud & DevOps",
      description: "Modern deployment and infrastructure management", 
      skills: [
        { name: "AWS", level: 88, years: "3+ years", icon: "☁️" },
        { name: "Docker", level: 78, years: "2+ years", icon: "🐳" },
        { name: "CI/CD", level: 85, years: "3+ years", icon: "🔄" },
        { name: "AWS Lambda", level: 82, years: "2+ years", icon: "λ" },
        { name: "S3 & CloudFront", level: 90, years: "3+ years", icon: "📦" },
        { name: "Kubernetes", level: 70, years: "1+ year", icon: "⚙️" },
      ]
    }
  ];

  const achievements = [
    { title: "AWS Certified", subtitle: "Solutions Architect", icon: "🏆" },
    { title: "5+ Years", subtitle: "Full Stack Experience", icon: "⭐" },
    { title: "50+ Projects", subtitle: "Successfully Delivered", icon: "🚀" },
    { title: "React Expert", subtitle: "Advanced Patterns", icon: "⚛️" },
  ];

  const getSkillColor = (level: number) => {
    if (level >= 90) return "bg-green-500";
    if (level >= 80) return "bg-blue-500"; 
    if (level >= 70) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Skills & <span className="text-gradient">Expertise</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crafting exceptional digital solutions with cutting-edge technologies
          </p>
        </div>

        {/* Achievements Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <Card 
              key={achievement.title}
              className="glass-card p-6 text-center hover:glow-effect smooth-transition animate-fade-up border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="text-lg font-semibold text-primary mb-1">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground">{achievement.subtitle}</p>
            </Card>
          ))}
        </div>

        {/* Skills Categories */}
        <div className="space-y-12">
          {skillCategories.map((category, categoryIndex) => (
            <div 
              key={category.category} 
              className="animate-fade-up"
              style={{ animationDelay: `${categoryIndex * 0.2}s` }}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                  {category.category}
                </h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {category.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.skills.map((skill, skillIndex) => (
                  <Card 
                    key={skill.name}
                    className="glass-card p-6 hover:glow-effect smooth-transition border-border/50 group"
                    style={{ animationDelay: `${(categoryIndex * 0.2) + (skillIndex * 0.1)}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl group-hover:scale-110 smooth-transition">
                          {skill.icon}
                        </span>
                        <div>
                          <h4 className="font-semibold text-foreground">{skill.name}</h4>
                          <p className="text-xs text-muted-foreground">{skill.years}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        {skill.level}%
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Proficiency</span>
                        <span className="text-foreground font-medium">{skill.level}%</span>
                      </div>
                      <Progress 
                        value={skill.level} 
                        className="h-2"
                        style={{
                          '--progress-background': `${getSkillColor(skill.level)}`
                        } as React.CSSProperties}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Skills */}
        <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-xl font-semibold mb-6 text-foreground">Also experienced with</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              "Redux", "Socket.io", "Jest", "Cypress", "Webpack", "Vite", 
              "Firebase", "Stripe API", "Prisma", "Tailwind", "Material-UI",
              "Git", "GitHub Actions", "Linux", "Nginx", "Redis"
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