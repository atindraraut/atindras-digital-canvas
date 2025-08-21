import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, BookOpen, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/src/resume/Atindra_Resume.pdf';
    link.download = 'Atindra_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 hero-gradient opacity-50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="absolute top-8 right-8 z-20">
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadResume}
            className="smooth-transition hover:border-primary hover:text-primary hover:bg-primary/10 glass-card text-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            Resume
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/articles')}
            className="smooth-transition hover:border-primary hover:text-primary hover:bg-primary/10 glass-card text-foreground"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Articles
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-6 animate-fade-up">
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground tracking-wider uppercase">Software Development Engineer</p>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              Hi, I'm <span className="text-gradient">Atindra</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Software Engineer with 3+ years of experience building scalable web applications and distributed systems.
            Passionate about solving complex problems with <span className="text-primary font-semibold">React</span>, 
            <span className="text-primary font-semibold"> Node.js</span>, and 
            <span className="text-primary font-semibold"> AWS</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button size="lg" className="group smooth-transition hover:glow-effect" onClick={scrollToProjects}>
              View My Work
              <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </Button>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="smooth-transition hover:border-primary hover:text-primary"
                onClick={() => window.open('https://github.com/atindraraut', '_blank')}
              >
                <Github className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="smooth-transition hover:border-primary hover:text-primary"
                onClick={() => window.open('https://linkedin.com/in/atindra-raut-202286137', '_blank')}
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="smooth-transition hover:border-primary hover:text-primary"
                onClick={() => navigate('/contact')}
              >
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default Hero;