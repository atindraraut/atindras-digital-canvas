import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import { getArticles, getAllTags } from "@/lib/articles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Articles = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const articles = getArticles();
  const allTags = getAllTags();
  
  const filteredArticles = selectedTag
    ? articles.filter(article => 
        article.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      )
    : articles;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReadArticle = (slug: string) => {
    navigate(`/articles/${slug}`);
  };

  return (
    <section className="py-20 relative min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Articles & <span className="text-gradient">Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sharing knowledge about web development, best practices, and the latest technologies
          </p>
        </div>

        {/* Tags Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-up">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
            className="smooth-transition"
          >
            All Articles
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className="smooth-transition"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <Card 
              key={article.slug}
              className="glass-card overflow-hidden hover:glow-effect smooth-transition animate-fade-up border-border/50 group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleReadArticle(article.slug)}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(article.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readTime} min read
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary smooth-transition">
                  {article.title}
                </h2>

                <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                  {article.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="outline"
                      className="px-2 py-1 text-xs border-primary/30 text-primary bg-primary/10"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-2 smooth-transition">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16 animate-fade-up">
            <p className="text-muted-foreground text-lg">
              No articles found for the selected tag.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSelectedTag(null)}
            >
              View All Articles
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Articles;