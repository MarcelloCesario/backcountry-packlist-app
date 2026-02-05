# Backcountry Packlist App

A gear management web application for backcountry activities (climbing, skiing, trail running, etc.) that helps outdoor enthusiasts organize their gear, build pack lists, and analyze kit preparedness.

## Features

- **Gear Management**: Create and manage categorized gear lists
- **Wish List**: Track gear you want to purchase
- **Pack Lists**: Build custom pack lists for specific trips/activities
- **Weight Calculation**: Calculate total payload weight for any pack list
- **Kit Analysis**: Analyze kit preparedness and identify weaknesses

## Tech Stack

- **Backend**: Node.js + Express (REST API)
- **Database**: PostgreSQL with migrations
- **Frontend**: React with Vite
- **Authentication**: JWT-based user authentication

## Project Structure

```
backcountry-packlist-app/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth and validation middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API route definitions
│   │   └── index.js        # Server entry point
│   └── package.json
├── database/               # Database management
│   ├── migrations/         # Schema migrations
│   └── seeds/              # Seed data
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context providers
│   │   └── App.jsx         # Main app component
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backcountry-packlist-app
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb backcountry_packlist
```

### 3. Backend Setup

```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your database credentials

# Run database migrations
npm run migrate

# (Optional) Seed the database
npm run seed

# Start the development server
npm run dev
```

The API server will start at `http://localhost:3000`

### 4. Frontend Setup

```bash
cd frontend
npm install

# Copy environment variables
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will start at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Gear Items
- `GET /api/gear` - Get all gear items for authenticated user
- `POST /api/gear` - Create a new gear item
- `GET /api/gear/:id` - Get a specific gear item
- `PUT /api/gear/:id` - Update a gear item
- `DELETE /api/gear/:id` - Delete a gear item

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Pack Lists
- `GET /api/packlists` - Get all pack lists for authenticated user
- `POST /api/packlists` - Create a new pack list
- `GET /api/packlists/:id` - Get a specific pack list with items
- `PUT /api/packlists/:id` - Update a pack list
- `DELETE /api/packlists/:id` - Delete a pack list
- `POST /api/packlists/:id/items` - Add item to pack list
- `DELETE /api/packlists/:id/items/:itemId` - Remove item from pack list
- `GET /api/packlists/:id/weight` - Get total weight of pack list

### Wish List
- `GET /api/wishlist` - Get all wish list items
- `POST /api/gear/:id/wishlist` - Toggle wish list status

## Environment Variables

### Backend (.env)
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/backcountry_packlist
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Database Migrations

```bash
cd backend

# Create a new migration
npm run migrate:create migration_name

# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback
```

## License

MIT
