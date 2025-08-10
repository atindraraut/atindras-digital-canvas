import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { getArticleBySlug } from "@/lib/articles";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useEffect } from "react";

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = slug ? getArticleBySlug(slug) : null;

  useEffect(() => {
    if (!article) {
      navigate('/articles');
    }
  }, [article, navigate]);

  if (!article) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/articles')}
          className="mb-8 smooth-transition hover:border-primary hover:text-primary animate-fade-up"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Button>

        {/* Article Header */}
        <header className="mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(article.date)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readTime} min read
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {article.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge 
                key={tag}
                variant="outline"
                className="px-3 py-1 border-primary/30 text-primary bg-primary/10 flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <article className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <MarkdownRenderer content={article.content} />
        </article>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-border/50 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/articles')}
              className="smooth-transition hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              More Articles
            </Button>
            
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Thanks for reading! Found this helpful?
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 smooth-transition hover:border-primary hover:text-primary"
                onClick={() => navigate('/contact')}
              >
                Get in touch
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Article;