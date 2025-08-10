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

// Sample articles data - In a real app, you'd read from files
export const articles: Article[] = [
  {
    title: "Building Scalable React Applications with TypeScript",
    description: "Learn how to structure large-scale React applications using TypeScript, proper component architecture, and state management patterns.",
    date: "2024-01-15",
    tags: ["React", "TypeScript", "Architecture"],
    slug: "building-scalable-react-applications-typescript",
    readTime: 8,
    content: `# Building Scalable React Applications with TypeScript

TypeScript has become an essential tool for building maintainable React applications. In this article, we'll explore best practices for structuring large-scale React applications.

## Component Architecture

When building scalable React applications, proper component architecture is crucial. Here are some key principles:

### 1. Component Composition

Instead of creating monolithic components, break them down into smaller, reusable pieces:

\`\`\`tsx
// ❌ Monolithic component
const UserProfile = ({ user }: { user: User }) => {
  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => editUser(user.id)}>Edit</button>
    </div>
  );
};

// ✅ Composed components
const UserAvatar = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="user-avatar" />
);

const UserInfo = ({ name, email }: { name: string; email: string }) => (
  <div className="user-info">
    <h2>{name}</h2>
    <p>{email}</p>
  </div>
);

const UserProfile = ({ user }: { user: User }) => (
  <div className="user-profile">
    <UserAvatar src={user.avatar} alt={user.name} />
    <UserInfo name={user.name} email={user.email} />
    <EditButton userId={user.id} />
  </div>
);
\`\`\`

### 2. Type Safety

Leverage TypeScript's type system to catch errors early:

\`\`\`tsx
interface Props {
  title: string;
  description?: string;
  onSubmit: (data: FormData) => Promise<void>;
}

const FormComponent: React.FC<Props> = ({ title, description, onSubmit }) => {
  // Component implementation
};
\`\`\`

## State Management Patterns

For complex applications, consider these state management approaches:

1. **Local State**: Use \`useState\` for component-specific state
2. **Lifted State**: Move state up when multiple components need it
3. **Context API**: For app-wide state that doesn't change frequently
4. **External Libraries**: Redux, Zustand, or Jotai for complex state logic

## Conclusion

Building scalable React applications requires thoughtful architecture, proper typing, and careful state management. By following these patterns, you'll create applications that are easier to maintain and extend over time.
`
  },
  {
    title: "Serverless Architecture with AWS Lambda and Node.js",
    description: "Explore how to build and deploy serverless applications using AWS Lambda, API Gateway, and other AWS services for maximum scalability.",
    date: "2024-01-10",
    tags: ["AWS", "Node.js", "Serverless"],
    slug: "serverless-architecture-aws-lambda-nodejs",
    readTime: 12,
    content: `# Serverless Architecture with AWS Lambda and Node.js

Serverless computing has revolutionized how we build and deploy applications. Let's explore how to create scalable serverless applications using AWS Lambda and Node.js.

## What is Serverless?

Serverless doesn't mean "no servers" - it means you don't manage the server infrastructure. AWS handles:

- Server provisioning and maintenance
- Automatic scaling
- High availability
- Security patches

## Setting Up AWS Lambda

Here's a basic Lambda function in Node.js:

\`\`\`javascript
exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    
    // Your business logic here
    const result = await processRequest(body);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
\`\`\`

## Best Practices

### 1. Keep Functions Small and Focused

Each Lambda function should have a single responsibility:

\`\`\`javascript
// ❌ Too many responsibilities
exports.userHandler = async (event) => {
  if (event.httpMethod === 'GET') {
    // Get user logic
  } else if (event.httpMethod === 'POST') {
    // Create user logic
  } else if (event.httpMethod === 'PUT') {
    // Update user logic
  }
};

// ✅ Separate functions
exports.getUser = async (event) => {
  // Get user logic only
};

exports.createUser = async (event) => {
  // Create user logic only
};
\`\`\`

### 2. Environment Variables for Configuration

\`\`\`javascript
const config = {
  dbHost: process.env.DB_HOST,
  apiKey: process.env.API_KEY,
  stage: process.env.STAGE
};
\`\`\`

### 3. Connection Reuse

Reuse database connections outside the handler:

\`\`\`javascript
let dbConnection;

const getConnection = async () => {
  if (!dbConnection) {
    dbConnection = await mongoose.connect(process.env.MONGODB_URI);
  }
  return dbConnection;
};

exports.handler = async (event) => {
  const db = await getConnection();
  // Use connection
};
\`\`\`

## Architecture Patterns

### API Gateway + Lambda + DynamoDB

This is a common pattern for REST APIs:

1. **API Gateway**: Routes HTTP requests
2. **Lambda**: Processes business logic
3. **DynamoDB**: Stores data

### Event-Driven Architecture

Use Lambda with various event sources:

- S3 events for file processing
- DynamoDB streams for data changes
- SQS for message processing
- CloudWatch events for scheduled tasks

## Deployment with Infrastructure as Code

Use AWS CDK or Serverless Framework:

\`\`\`yaml
# serverless.yml
service: my-serverless-app

provider:
  name: aws
  runtime: nodejs18.x
  environment:
    DB_HOST: \${env:DB_HOST}

functions:
  getUser:
    handler: handlers/user.get
    events:
      - http:
          path: /users/{id}
          method: get
          cors: true
\`\`\`

## Monitoring and Debugging

- Use CloudWatch Logs for monitoring
- AWS X-Ray for distributed tracing
- Custom metrics for business KPIs

## Conclusion

Serverless architecture with AWS Lambda provides excellent scalability and cost-efficiency. By following best practices and using the right tools, you can build robust serverless applications that scale automatically with demand.
`
  },
  {
    title: "Modern CSS Techniques with Tailwind CSS",
    description: "Discover advanced CSS patterns and how to implement them efficiently using Tailwind CSS utility classes and custom components.",
    date: "2024-01-05",
    tags: ["CSS", "Tailwind", "Frontend"],
    slug: "modern-css-techniques-tailwind",
    readTime: 6,
    content: `# Modern CSS Techniques with Tailwind CSS

Tailwind CSS has changed how we approach styling web applications. Let's explore some modern CSS techniques and how to implement them with Tailwind.

## Utility-First Approach

Instead of writing custom CSS classes, Tailwind provides utility classes:

\`\`\`html
<!-- Traditional CSS -->
<div class="card">
  <h2 class="card-title">Title</h2>
</div>

<!-- Tailwind CSS -->
<div class="bg-white rounded-lg shadow-md p-6">
  <h2 class="text-2xl font-bold text-gray-800">Title</h2>
</div>
\`\`\`

## Advanced Layout Techniques

### CSS Grid with Tailwind

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white p-6 rounded-lg shadow">Item 1</div>
  <div class="bg-white p-6 rounded-lg shadow">Item 2</div>
  <div class="bg-white p-6 rounded-lg shadow">Item 3</div>
</div>
\`\`\`

### Flexbox Patterns

\`\`\`html
<!-- Center content -->
<div class="flex items-center justify-center min-h-screen">
  <div class="text-center">Centered Content</div>
</div>

<!-- Sidebar layout -->
<div class="flex">
  <aside class="w-64 bg-gray-100">Sidebar</aside>
  <main class="flex-1 p-8">Main Content</main>
</div>
\`\`\`

## Custom Components

For repeated patterns, create components:

\`\`\`css
@layer components {
  .btn {
    @apply px-4 py-2 rounded font-semibold transition-colors;
  }
  
  .btn-primary {
    @apply bg-blue-500 text-white hover:bg-blue-600;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}
\`\`\`

## Dark Mode

Tailwind makes dark mode simple:

\`\`\`html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 class="text-2xl font-bold">
    This adapts to dark mode automatically
  </h1>
</div>
\`\`\`

## Responsive Design

Mobile-first responsive design:

\`\`\`html
<div class="text-sm md:text-base lg:text-lg xl:text-xl">
  Responsive text that grows with screen size
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Responsive grid -->
</div>
\`\`\`

## Animation and Transitions

\`\`\`html
<button class="transform transition-transform hover:scale-105 active:scale-95">
  Hover to scale
</button>

<div class="opacity-0 transition-opacity duration-500 hover:opacity-100">
  Fade in on hover
</div>
\`\`\`

## Custom Utilities

Extend Tailwind with custom utilities:

\`\`\`js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
      },
      colors: {
        'brand': {
          500: '#your-color',
        }
      }
    }
  }
}
\`\`\`

## Performance Optimization

- Use PurgeCSS to remove unused styles
- JIT mode for faster builds
- Component extraction for reusability

## Conclusion

Tailwind CSS enables rapid development while maintaining consistency. By combining utility classes with component patterns, you can build beautiful, maintainable interfaces efficiently.
`
  }
];

export const getArticles = (): Article[] => {
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug);
};

export const getArticlesByTag = (tag: string): Article[] => {
  return articles.filter(article => 
    article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
};

export const getAllTags = (): string[] => {
  const tags = articles.flatMap(article => article.tags);
  return Array.from(new Set(tags));
};