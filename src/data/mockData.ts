// Mock data for portfolio
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  year: number;
  highlights: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null; // null means present
  description: string;
  technologies: string[];
  highlights: string[];
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Post {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
}

export interface GithubStats {
  username: string;
  repoCount: number;
  followers: number;
  contributions: number;
  topLanguages: { name: string; percentage: number }[];
  recentActivity: { date: string; message: string; repo: string }[];
}

// Mock Data
export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Automotive Dashboard',
    description: 'Real-time dashboard for vehicle diagnostics and monitoring',
    technologies: ['React', 'TypeScript', 'WebSockets', 'D3.js'],
    githubUrl: 'https://github.com/username/auto-dashboard',
    liveUrl: 'https://auto-dashboard.example.com',
    year: 2023,
    highlights: [
      'Real-time data visualization',
      'Cross-platform compatibility',
      'Customizable widgets and layouts',
      'Low-latency performance optimizations'
    ]
  },
  {
    id: 'project-2',
    title: 'Developer Terminal Portfolio',
    description: 'Interactive terminal-style portfolio website with vim-like navigation',
    technologies: ['React', 'Vite', 'Zustand', 'Tailwind CSS'],
    githubUrl: 'https://github.com/username/terminal-portfolio',
    liveUrl: 'https://terminal-portfolio.example.com',
    year: 2023,
    highlights: [
      'Retro terminal UI with NEON-inspired aesthetics',
      'Vim-like keyboard navigation',
      'Responsive design for all device sizes',
      'Animated terminal boot sequence'
    ]
  },
  {
    id: 'project-3',
    title: 'Garden Monitoring System',
    description: 'IoT solution for monitoring and automating garden care',
    technologies: ['Rust', 'ESP32', 'MQTT', 'React Native'],
    githubUrl: 'https://github.com/username/garden-monitor',
    year: 2023,
    highlights: [
      'Low-power sensor network',
      'Automated watering system',
      'Weather data integration',
      'Mobile app for remote monitoring'
    ]
  }
];

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    company: 'Tech Innovations Inc.',
    position: 'Senior Frontend Engineer',
    startDate: '2023-01',
    endDate: null,
    description: 'Leading development of modern web applications with focus on performance and user experience',
    technologies: ['React', 'TypeScript', 'GraphQL', 'WebSockets', 'WebGL'],
    highlights: [
      'Redesigned and implemented a real-time dashboard reducing load times by 65%',
      'Led migration from a legacy framework to React, improving developer productivity',
      'Implemented WebGL-based data visualization components handling millions of data points',
      'Mentored junior developers and established coding standards and best practices'
    ]
  },
  {
    id: 'exp-2',
    company: 'Digital Solutions Group',
    position: 'Full Stack Developer',
    startDate: '2021-03',
    endDate: '2022-12',
    description: 'Developed enterprise applications for financial and healthcare industries',
    technologies: ['Node.js', 'Express', 'React', 'MongoDB', 'Docker', 'AWS'],
    highlights: [
      'Built microservice architecture for scalable applications handling 10,000+ concurrent users',
      'Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 70%',
      'Optimized database queries resulting in 40% faster API response times',
      'Designed and implemented RESTful APIs consumed by multiple client applications'
    ]
  },
  {
    id: 'exp-3',
    company: 'Creative Tech Labs',
    position: 'Frontend Developer',
    startDate: '2019-06',
    endDate: '2021-02',
    description: 'Developed interactive web applications and e-commerce solutions',
    technologies: ['Vue.js', 'JavaScript', 'Sass', 'Webpack', 'Firebase'],
    highlights: [
      'Created responsive e-commerce interfaces used by over 50,000 monthly customers',
      'Implemented real-time inventory tracking and notification system',
      'Reduced page load times by 45% through code optimization and lazy loading',
      'Collaborated with UX designers to implement intuitive user interfaces'
    ]
  }
];

export const skills: Skill[] = [
  {
    category: 'Frontend',
    items: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Redux/Zustand', 'WebGL', 'D3.js']
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Rust', 'Express', 'NestJS', 'GraphQL', 'REST API Design']
  },
  {
    category: 'DevOps',
    items: ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS', 'Terraform', 'CI/CD']
  },
  {
    category: 'Other',
    items: ['Test-Driven Development', 'Agile/Scrum', 'System Design', 'Performance Optimization']
  }
];

export const posts: Post[] = [
  {
    id: 'post-1',
    title: 'Building User Interfaces with Terminal Aesthetics',
    date: '2023-02-15',
    tags: ['UI/UX', 'Frontend', 'Design'],
    excerpt: 'How to create modern applications with retro terminal aesthetics',
    content: `
# Building User Interfaces with Terminal Aesthetics

Terminal-style interfaces are making a comeback in modern web development. Here's why they work and how to implement them effectively.

## Benefits of Terminal-Inspired UIs

- **Focus on Content**: Terminal UIs strip away distractions
- **Keyboard-First Navigation**: Improves power user efficiency
- **Nostalgic Appeal**: Connects with users who appreciate computing history
- **Unique Aesthetic**: Stands out in a crowded web landscape

## Implementation Tips

When creating a terminal-inspired interface, consider:

- Using monospaced fonts for authentic terminal feel
- Implementing keyboard shortcuts for navigation
- Adding subtle animations like cursor blinks
- Supporting both dark and light themes

\`\`\`jsx
// Example React component for a terminal-style input
const TerminalInput = () => {
  const [input, setInput] = useState('');
  
  return (
    <div className="terminal-line">
      <span className="terminal-prompt">$</span>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="terminal-input"
      />
      <span className="terminal-cursor">█</span>
    </div>
  );
};
\`\`\`

Remember that a terminal-style UI doesn't mean sacrificing usability. Always ensure your interface is still accessible and easy to understand.
    `
  },
  {
    id: 'post-2',
    title: 'Optimizing IoT Devices for Garden Monitoring',
    date: '2022-11-03',
    tags: ['IoT', 'Gardening', 'Rust'],
    excerpt: 'Creating low-power, long-lasting garden monitoring systems with Rust and ESP32',
    content: `
# Optimizing IoT Devices for Garden Monitoring

Garden monitoring systems need to be reliable, energy-efficient, and durable. Here's how we built our solution.

## Hardware Selection

For our garden monitoring project, we selected:

- **ESP32** microcontrollers for their balance of power and efficiency
- **Capacitive soil moisture sensors** to avoid corrosion issues
- **18650 Li-ion batteries** with solar charging
- **Weather-resistant enclosures** rated IP66

## Software Architecture

We used Rust for the firmware, which provides:

- Memory safety without garbage collection
- Excellent power management
- Strong typing to prevent runtime errors
- Small binary size

\`\`\`rust
// Example Rust code for power-efficient sensor reading
fn read_moisture_sensor(pin: u8) -> Result<u16, Error> {
    // Power on the sensor
    set_pin_high(SENSOR_POWER_PIN);
    
    // Wait for the sensor to stabilize
    delay_ms(100);
    
    // Take multiple readings for accuracy
    let readings: Vec<u16> = (0..5)
        .map(|_| {
            delay_ms(10);
            adc_read(pin)
        })
        .collect();
    
    // Power off the sensor to save energy
    set_pin_low(SENSOR_POWER_PIN);
    
    // Return the average reading
    let sum: u32 = readings.iter().map(|&v| v as u32).sum();
    Ok((sum / readings.len() as u32) as u16)
}
\`\`\`

By carefully managing power states and using asynchronous programming, our devices achieve battery life of up to 6 months on a single charge.
    `
  }
];

export const githubStats: GithubStats = {
  username: 'kauefontes',
  repoCount: 48,
  followers: 327,
  contributions: 1254,
  topLanguages: [
    { name: 'TypeScript', percentage: 45 },
    { name: 'Rust', percentage: 30 },
    { name: 'JavaScript', percentage: 15 },
    { name: 'CSS', percentage: 5 },
    { name: 'Python', percentage: 5 }
  ],
  recentActivity: [
    {
      date: '2023-05-10',
      message: 'Fix performance issue in dashboard rendering',
      repo: 'auto-dashboard'
    },
    {
      date: '2023-05-08',
      message: 'Add keyboard shortcut documentation',
      repo: 'terminal-portfolio'
    },
    {
      date: '2023-05-05',
      message: 'Implement dark mode toggle with theme persistence',
      repo: 'terminal-portfolio'
    },
    {
      date: '2023-05-01',
      message: 'Update dependencies and fix security vulnerabilities',
      repo: 'garden-monitor'
    }
  ]
};
