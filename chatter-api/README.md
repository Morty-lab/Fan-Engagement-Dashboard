# Chatter API

A Laravel-based API for the Chatter fan engagement application, providing endpoints for managing conversations, fans, messages, and templates.

## Features

- **Conversation Management**: Create, read, and manage fan conversations
- **Message System**: Send and receive messages with real-time broadcasting
- **Fan Profiles**: Access fan information and engagement data
- **Template System**: Create and manage message templates
- **Priority Management**: Set conversation priorities for better workflow
- **Real-time Updates**: WebSocket broadcasting for live message updates

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Morty-lab/Fan-Engagement-Dashboard.git
   cd Fan-Engagement-Dashboard
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database setup**
   ```bash
   php artisan migrate --seed
   ```
   > **Note**: Seeded data may include Latin placeholder text for testing purposes.

5. **Start the development server**
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`

## API Routes

### Conversation Routes

| Method | Endpoint | Controller Method | Description |
|--------|----------|-------------------|-------------|
| `GET` | `/conversations` | `ConversationController@index` | Retrieve all conversations |
| `GET` | `/conversation/{id}` | `ConversationController@show` | Get specific conversation details |
| `POST` | `/conversation/{id}/mark-read` | `ConversationController@markAsRead` | Mark conversation as read |
| `PUT` | `/conversation/{id}/priority` | `ConversationController@setPriority` | Set conversation priority level |

### Fan Routes

| Method | Endpoint | Controller Method | Description |
|--------|----------|-------------------|-------------|
| `GET` | `/fan/{id}` | `FanController@show` | Get fan profile and details |

### Message Routes

| Method | Endpoint | Controller Method | Description |
|--------|----------|-------------------|-------------|
| `GET` | `/messages` | `MessageController@index` | Retrieve all messages |
| `GET` | `/message/{id}` | `MessageController@show` | Get specific message details |
| `POST` | `/message` | `MessageController@store` | Send a new message |

### Template Routes

| Method | Endpoint | Controller Method | Description |
|--------|----------|-------------------|-------------|
| `GET` | `/templates` | `TemplateController@index` | Retrieve all message templates |
| `POST` | `/template` | `TemplateController@store` | Create a new template |
| `PUT` | `/template/{id}` | `TemplateController@update` | Update existing template |
| `DELETE` | `/template/{id}` | `TemplateController@delete` | Delete a template |

### Testing Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/broadcast-test` | Test WebSocket broadcasting functionality |

## Database Schema

The API uses the following main entities:

- **Fans**: User profiles with username, display name, and spending data
- **Conversations**: Chat threads linked to fans with priority levels
- **Messages**: Individual messages within conversations (from fan or chatter)
- **Templates**: Reusable message templates

## Usage Examples

### Get All Conversations
```bash
curl -X GET http://localhost:8000/conversations
```

### Get Specific Conversation
```bash
curl -X GET http://localhost:8000/conversation/1
```

### Send a Message
```bash
curl -X POST http://localhost:8000/message \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": 1,
    "sender": "chatter",
    "content": "Hello! How can I help you today?",
    "is_read": false
  }'
```

### Mark Conversation as Read
```bash
curl -X POST http://localhost:8000/conversation/1/mark-read
```

### Set Conversation Priority
```bash
curl -X PUT http://localhost:8000/conversation/1/priority \
  -H "Content-Type: application/json" \
  -d '{
    "priority_level": 2
  }'
```

### Get Fan Details
```bash
curl -X GET http://localhost:8000/fan/1
```

### Create a Template
```bash
curl -X POST http://localhost:8000/template \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Welcome Message",
    "body": "Welcome to our community! We're excited to have you here."
  }'
```

### Update a Template
```bash
curl -X PUT http://localhost:8000/template/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Welcome Message",
    "body": "Welcome to our amazing community! We're thrilled to have you join us."
  }'
```

### Delete a Template
```bash
curl -X DELETE http://localhost:8000/template/1
```

## Real-time Broadcasting

The API includes WebSocket broadcasting for real-time message updates using Laravel's event system. When a message is sent, a `MessageSent` event is broadcasted to connected clients.

## Requirements

- PHP 8.1+
- Laravel 11.x
- MySQL/PostgreSQL
- Composer
