# Fan Engagement Dashboard App

A modern web application for managing fan conversations and engagement, built as part of the Fullstack Developer challenge from Fandom Agency.

## Features

- **Real-time Messaging**: Live chat interface for fan communication
- **Conversation Management**: Organize and prioritize fan conversations
- **Message Templates**: Quick response templates for common interactions
- **AI Reply Suggestions**: Smart AI-powered response recommendations
- **Fan Profiles**: View fan details and engagement history
- **Priority System**: Set conversation priorities for better workflow management
- **Conversion Metrics**: Track engagement metrics and conversion rates
- **Theme Support**: Light and dark mode toggle for user preference
- **Mobile Responsive**: Optimized for mobile devices up to 450px width

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Backend**: Laravel PHP API
- **Real-time**: WebSocket integration for live updates
- **Database**: MySQL/PostgreSQL
- **Build Tool**: Vite
- **Styling**: Responsive CSS with mobile-first design
- **Linting**: ESLint for code quality
- **Package Manager**: npm

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Morty-lab/Fan-Engagement-Dashboard.git
   cd Fan-Engagement-Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Mobile Responsiveness

The application is fully responsive and optimized for mobile devices with a **maximum width of 450px**. The mobile interface includes:

- Touch-friendly navigation
- Optimized conversation layout
- Condensed message display
- Mobile-specific UI components
- Smooth scrolling and interactions
- Adaptive AI suggestion panel
- Mobile-optimized metrics dashboard

## Theme Support

The application supports both **light and dark modes** with:

- System preference detection
- Manual theme toggle
- Persistent theme selection
- Smooth theme transitions
- Optimized contrast ratios for accessibility
- Theme-aware component styling

## AI Features

### Reply Suggestions
- Context-aware response recommendations
- Personalized suggestions based on fan history
- Template integration with AI suggestions
- Quick-select suggestion interface
- Learning from successful interactions

### Conversion Metrics
- Real-time engagement tracking
- Conversion rate analytics
- Fan spending correlation
- Response time metrics
- Success rate monitoring
- Interactive dashboard with charts and graphs

## Development

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production with TypeScript compilation
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint code linting

### Project Structure

```
fan-engagement-dashboard/
├── public/                 # Static assets
├── src/                   # Source code
│   ├── api/              # API service layers
│   ├── assets/           # Images, fonts, and other assets
│   ├── components/       # Reusable React components
│   │   ├── dashboard/    # Dashboard-specific components
│   │   ├── messages/     # Message-related components
│   │   └── sidebars/     # Sidebar components
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper functions and utilities
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Application entry point
├── node_modules/        # Dependencies
├── .eslintrc.config.js  # ESLint configuration
├── .gitignore          # Git ignore rules
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── package-lock.json   # Dependency lock file
├── README.md           # Project documentation
└── vite.config.js      # Vite configuration
```

## API Integration

This frontend application works in conjunction with the Chatter API. Make sure to:

1. Set up the Laravel backend API
2. Configure the API endpoint in your environment variables

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)