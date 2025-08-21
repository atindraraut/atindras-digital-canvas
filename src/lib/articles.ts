export interface ArticleMetadata {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  readTime: number;
}

export interface Article extends ArticleMetadata {
  content: string;
}

// Simple frontmatter parser for browser compatibility
const parseFrontmatter = (markdownContent: string) => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdownContent.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: markdownContent };
  }
  
  const [, yamlContent, content] = match;
  const data: any = {};
  
  // Simple YAML parsing for basic frontmatter
  const lines = yamlContent.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      
      // Handle arrays (simple bracket notation)
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayValue = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
        data[key] = arrayValue;
        continue;
      }
      
      // Handle numbers
      if (!isNaN(Number(value)) && value !== '') {
        data[key] = Number(value);
        continue;
      }
      
      data[key] = value;
    }
  }
  
  return { data, content };
};

// Function to import all markdown files from the articles folder
const importArticles = () => {
  const articles: Article[] = [];
  
  // Import markdown files using dynamic imports
  const modules = import.meta.glob('../articles/*.md', { eager: true, as: 'raw' });
  
  for (const path in modules) {
    const markdownContent = modules[path];
    const { data, content } = parseFrontmatter(markdownContent);
    
    // Validate that all required frontmatter fields are present
    if (data.title && data.description && data.date && data.tags && data.slug && data.readTime) {
      articles.push({
        title: data.title,
        description: data.description,
        date: data.date,
        tags: Array.isArray(data.tags) ? data.tags : [],
        slug: data.slug,
        readTime: data.readTime,
        content
      });
    }
  }
  
  return articles;
};

// Cache the articles to avoid re-parsing on every call
let cachedArticles: Article[] | null = null;

const getArticlesFromFiles = (): Article[] => {
  if (!cachedArticles) {
    cachedArticles = importArticles();
  }
  return cachedArticles;
};

export const getArticles = (): Article[] => {
  const articles = getArticlesFromFiles();
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  const articles = getArticlesFromFiles();
  return articles.find(article => article.slug === slug);
};

export const getArticlesByTag = (tag: string): Article[] => {
  const articles = getArticlesFromFiles();
  return articles.filter(article => 
    article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
};

export const getAllTags = (): string[] => {
  const articles = getArticlesFromFiles();
  const tags = articles.flatMap(article => article.tags);
  return Array.from(new Set(tags));
};