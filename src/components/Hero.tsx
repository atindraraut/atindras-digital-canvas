import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 hero-gradient opacity-50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-6 animate-fade-up">
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground tracking-wider uppercase">Full Stack Developer</p>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              Hi, I'm <span className="text-gradient">Atindra</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            I build exceptional digital experiences with <span className="text-primary font-semibold">React</span>, 
            <span className="text-primary font-semibold"> Node.js</span>, and 
            <span className="text-primary font-semibold"> AWS</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button size="lg" className="group smooth-transition hover:glow-effect">
              View My Work
              <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </Button>
            <div className="flex gap-4">
              <Button variant="outline" size="lg" className="smooth-transition hover:border-primary hover:text-primary">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="smooth-transition hover:border-primary hover:text-primary">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="smooth-transition hover:border-primary hover:text-primary">
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