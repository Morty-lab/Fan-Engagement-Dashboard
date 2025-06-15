# Fan Engagement App

A comprehensive fan engagement application built with Laravel 11 and React TypeScript using a complete API-based architecture. The frontend and backend are completely decoupled, communicating solely through RESTful API endpoints.

## Installation

### Quick Start
1. Clone the entire repository:
   ```bash
   git clone https://github.com/Morty-lab/Fan-Engagement-Dashboard.git
   cd Fan-Engagement-Dashboard
   ```

2. **Backend Setup**: Navigate to the [chatter-api](https://github.com/Morty-lab/Fan-Engagement-Dashboard/tree/main/chatter-api) folder for complete installation guide and comprehensive API documentation.

3. **Frontend Setup**: Navigate to the [fan-engagement-dashboard](https://github.com/Morty-lab/Fan-Engagement-Dashboard/tree/main/fan-engagement-dashboard) folder for React application setup instructions.

### API Configuration
Make sure to add these broadcasting configuration variables to your `chatter-api/.env` file:

```env
BROADCAST_CONNECTION=pusher
PUSHER_APP_ID=2007593
PUSHER_APP_KEY=6d9ad28838603c0b57ae
PUSHER_APP_SECRET=6b9e3fe46a282a7e6846
PUSHER_APP_CLUSTER=ap1
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
```

**Important**: Remove any duplicate broadcasting environment variables and ensure your database configuration is properly set in the `.env` file. Don't forget to run the database migrations - all detailed instructions are available in the chatter-api documentation.

### API Testing
We strongly recommend using **Postman** for testing the API endpoints during development. The API documentation in the chatter-api folder includes example requests and responses for all available endpoints.

## Technologies and Rationale

This application leverages modern web development technologies to create a scalable and maintainable fan engagement platform:

**Backend - Laravel 11**: We chose Laravel 11 for its exceptional capability as a standalone API framework. Laravel's robust ecosystem, built-in authentication, eloquent ORM, and extensive middleware support make it ideal for creating secure and efficient APIs. The framework's API-only approach allows for complete separation of concerns and enables multiple frontend applications to consume the same backend services.

**Frontend - React TypeScript**: React was selected for its component-based architecture and excellent performance, while TypeScript integration ensures type safety and reduces runtime errors. This combination significantly improves code maintainability, enables better IDE support with autocomplete and error detection, and enhances the overall scalability of the system. The strict typing system helps prevent unnecessary code bloat and makes the codebase more predictable for future development.

**Styling - Tailwind CSS**: Tailwind CSS provides utility-first styling that promotes consistent design patterns while maintaining flexibility and reducing CSS bundle size.

**Real-time Communication - Pusher**: Integrated for real-time messaging capabilities, enabling instant communication between users.

**AI Integration - GroqCloud**: Leveraged GroqCloud AI for intelligent reply suggestions, providing users with context-aware response recommendations that enhance communication efficiency and user experience.

The decoupled architecture simulates real-world API-based applications, making it easier to scale individual components, implement microservices, or integrate with mobile applications in the future.

## Features

- Real-time messaging and communication
- User authentication and authorization
- AI-powered reply suggestions using GroqCloud
- Responsive design for multiple device types
- API-first architecture for maximum flexibility
- Type-safe frontend development with TypeScript

## Future Improvements

- **Performance Optimization**: Implement caching strategies and database query optimization to significantly reduce conversation loading times
- **Enhanced Real-time Features**: Add reply-to-message functionality, message reactions, typing indicators, and read receipts
- **UI/UX Enhancements**: Improve overall user interface design, enhance mobile responsiveness, and implement dark mode support
- **Template Management**: Create and edit quick reply templates for common responses
- **File Management**: Implement file transfer capabilities with cloud storage integration for sharing documents, images, and other media
- **AI-Powered Features**: Integrate model-based conversation sorting, sentiment analysis, and automated response suggestions
- **Advanced Analytics**: Add user engagement metrics, conversation analytics, and reporting dashboards
- **Notification System**: Implement push notifications for mobile and desktop applications
- **Multi-language Support**: Add internationalization for global user base
- **API Rate Limiting**: Implement advanced rate limiting and API throttling for better security

## Contributing

Please read the documentation in both the `chatter-api` and `fan-engagement-dashboard` folders for detailed setup instructions and development guidelines.
