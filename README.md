# Microservices Backend with GraphQL Gateway

A complete microservices architecture built with NestJS, featuring a GraphQL Gateway and three specialized microservices.

## 🏗️ Architecture

```
┌─────────────────┐
│  GraphQL Gateway │  (Port 3000)
│     (NestJS)     │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌────────┐ ┌─────────────┐ ┌─────────────────┐
│ Auth   │ │    User     │ │  Timetracking   │
│Service │ │   Service   │ │    Service      │
│:5001   │ │    :5002    │ │     :5003       │
└────┬───┘ └──────┬──────┘ └─────────┬───────┘
     │            │                  │
     ▼            ▼                  ▼
┌──────────┐ ┌──────────┐ ┌─────────────────┐
│PostgreSQL│ │ MongoDB  │ │   PostgreSQL    │
│   :5432  │ │  :27017  │ │     :5433       │
└──────────┘ └──────────┘ └─────────────────┘
```

## 🚀 Services

### 1. **Auth Service** (Port: 5001)
- **Database**: PostgreSQL
- **Features**:
  - User registration (`/auth/register`)
  - Login (`/auth/login`)
  - JWT validation (`/auth/validate`)
  - JWT token generation

### 2. **User Service** (Port: 5002)
- **Database**: MongoDB
- **Features**:
  - User profile management
  - Complete profile CRUD operations
  - Personal information storage

### 3. **Timetracking Service** (Port: 5003)
- **Database**: PostgreSQL
- **Features**:
  - Clock-in/Clock-out
  - Work time history
  - Total hours calculation
  - Current user status

### 4. **GraphQL Gateway** (Port: 3000)
- **Features**:
  - Single entry point for all operations
  - JWT validation on all protected operations
  - Data aggregation from multiple microservices
  - GraphQL Playground available at `/graphql`

## 🛠️ Technologies

- **Framework**: NestJS
- **Databases**: PostgreSQL + MongoDB
- **Authentication**: JWT
- **API**: GraphQL (Gateway) + REST (Microservices)
- **Containers**: Docker & Docker Compose
- **Validation**: class-validator + class-transformer

## 📦 Installation and Setup

### Prerequisites
- Docker
- Docker Compose
- Node.js 18+ (para desarrollo local)

### 1. Clone and setup
```bash
git clone <repository-url>
cd MicroserverExample
```

### 2. Run with Docker (Recommended)
```bash
# Run all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### 3. Local development (Optional)
```bash
# Install dependencies for all services
npm run install:all

# Run each service individually
cd auth-service && npm run start:dev
cd user-service && npm run start:dev
cd timetracking-service && npm run start:dev
cd gateway && npm run start:dev
```

## 🔑 Environment Variables

Each service has its own `.env` file:

### Auth Service
```env
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=auth_user
DB_PASSWORD=auth_password
DB_DATABASE=auth_db
JWT_SECRET=auth-jwt-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

### User Service
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/user_db
```

### Timetracking Service
```env
PORT=5003
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=timetracking_user
DB_PASSWORD=timetracking_password
DB_DATABASE=timetracking_db
```

### Gateway
```env
PORT=3000
AUTH_SERVICE_URL=http://localhost:5001
USER_SERVICE_URL=http://localhost:5002
TIMETRACKING_SERVICE_URL=http://localhost:5003
JWT_SECRET=auth-jwt-secret-key-change-this-in-production
```

## 📚 API Documentation

### GraphQL Gateway (http://localhost:3000/graphql)

#### Authentication
```graphql
# Registration
mutation {
  register(input: {
    email: "user@example.com"
    password: "password123"
    firstName: "John"
    lastName: "Doe"
  }) {
    access_token
    user {
      id
      email
      firstName
      lastName
    }
  }
}

# Login
mutation {
  login(input: {
    email: "user@example.com"
    password: "password123"
  }) {
    access_token
    user {
      id
      email
      firstName
      lastName
    }
  }
}
```

#### Profile Management
```graphql
# Create profile (requires authentication)
mutation {
  createUserProfile(input: {
    userId: "user-id"
    email: "user@example.com"
    firstName: "John"
    lastName: "Doe"
    phone: "+1234567890"
  }) {
    userId
    email
    firstName
    lastName
    phone
  }
}

# Get my profile
query {
  getMyProfile {
    userId
    email
    firstName
    lastName
    phone
    address
    city
    country
  }
}
```

#### Timetracking
```graphql
# Clock-in
mutation {
  myClockIn(description: "Starting work") {
    id
    userId
    clockIn
    status
    description
  }
}

# Clock-out
mutation {
  myClockOut {
    id
    userId
    clockIn
    clockOut
    status
    hoursWorked
  }
}

# View current status
query {
  getMyCurrentStatus {
    isActive
    activeEntry {
      id
      clockIn
      description
    }
  }
}

# View history
query {
  getMyTimeEntries(startDate: "2024-01-01", endDate: "2024-12-31") {
    id
    clockIn
    clockOut
    hoursWorked
    description
    status
  }
}

# View total hours
query {
  getMyTotalHours(startDate: "2024-01-01", endDate: "2024-12-31") {
    totalHours
  }
}
```

## 🔐 Authentication

All protected operations require a JWT token in the header:
```
Authorization: Bearer <jwt-token>
```

The token is obtained through login or registration and must be included in all protected queries and mutations.

## 🗜️ Database

### PostgreSQL (Auth Service)
- **Port**: 5432
- **User**: auth_user
- **Database**: auth_db
- **Tables**: users

### MongoDB (User Service)
- **Port**: 27017
- **Database**: user_db
- **Collections**: users

### PostgreSQL (Timetracking Service)
- **Port**: 5433 (mapped from container port 5432)
- **User**: timetracking_user
- **Database**: timetracking_db
- **Tables**: time_entries

## 🚦 Available Scripts

```bash
# Start all services
npm start

# Start with rebuild
npm run start:dev

# Stop services
npm run stop

# Clean volumes
npm run clean

# View logs
npm run logs

# Install dependencies for all services
npm run install:all
```

## 🔧 Development

For development, each microservice can run independently:

1. Ensure databases are running
2. Configure appropriate environment variables
3. Run `npm run start:dev` in each service

## 📋 Versioning and Releases

This project uses a **monorepo with independent service versioning** strategy.

### 🏷️ Versioning Strategy

Each service maintains its own version following [Semantic Versioning](https://semver.org/):
- **auth-service**: v1.0.0
- **user-service**: v1.0.0  
- **timetracking-service**: v1.0.0
- **gateway**: v1.0.0

### 🛠️ Versioning Scripts

#### Manual Versioning
```bash
# Increment service version
./scripts/version.sh <service-name> <version-type>

# Examples
./scripts/version.sh auth-service patch    # 1.0.0 → 1.0.1
./scripts/version.sh user-service minor   # 1.0.0 → 1.1.0
./scripts/version.sh gateway major        # 1.0.0 → 2.0.0
```

#### Release Building
```bash
# Build Docker images with version tags
./scripts/release.sh <service-name>
./scripts/release.sh all  # Build all services
```

### 🏷️ Git Tags
- Format: `<service-name>-v<version>`
- Examples: `auth-service-v1.0.1`, `gateway-v2.0.0`

### 🔄 Automated CI/CD

#### Versioning from GitHub Actions
1. Go to the **Actions** tab in GitHub
2. Select **Version Management** workflow
3. Click **Run workflow**
4. Choose service and version type

#### Automated Pipeline
- **Push to main**: Runs tests and integration
- **Tag push**: Builds and pushes Docker images
- **Pull requests**: Runs complete test suite

### 📊 Version Tracking

Current versions are tracked in `version.json`:
```json
{
  "services": {
    "auth-service": { "version": "1.0.0", "changelog": "Initial release" },
    "user-service": { "version": "1.0.0", "changelog": "Initial release" },
    "timetracking-service": { "version": "1.0.0", "changelog": "Initial release" },
    "gateway": { "version": "1.0.0", "changelog": "Initial release" }
  },
  "lastUpdated": "2025-08-05T00:00:00Z"
}
```

## 📝 Next Steps

- [ ] Implement unit and integration tests
- [ ] Add centralized logging
- [ ] Implement rate limiting
- [ ] Add monitoring and metrics
- [x] Configure CI/CD pipeline
- [ ] Add API documentation with Swagger
- [ ] Implement caching with Redis