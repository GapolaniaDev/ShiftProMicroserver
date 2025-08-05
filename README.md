# Company Shift Management - Microservices Architecture

A complete company shift management system migrated from Laravel to modern microservices architecture built with NestJS, featuring role-based access control, geolocation tracking, and timezone management.

## 🏗️ Architecture

```
┌─────────────────┐
│  GraphQL Gateway │  (Port 3000)
│     (NestJS)     │
└─────────┬───────┘
          │
    ┌─────┴─────────────────────────────────┐
    │                                       │
    ▼           ▼           ▼               ▼
┌────────┐ ┌─────────┐ ┌──────────┐ ┌─────────────────┐
│ Auth   │ │  User   │ │Employee  │ │ Shift Management│
│Service │ │ Service │ │ Service  │ │    Service      │
│:5001   │ │ :5002   │ │ :5004    │ │     :5005       │
└────┬───┘ └─────┬───┘ └─────┬────┘ └─────────┬───────┘
     │           │           │                │
┌────────┐ ┌─────────────┐ ┌─────────────────┐ ┌─────────────────┐
│Payroll │ │Timetracking │ │   PostgreSQL    │ │   PostgreSQL    │
│Service │ │  Service    │ │     :5434       │ │     :5435       │
│:5006   │ │   :5003     │ └─────────────────┘ └─────────────────┘
└────┬───┘ └─────┬───────┘
     │           │
     ▼           ▼
┌──────────┐ ┌─────────────────┐
│PostgreSQL│ │   PostgreSQL    │
│   :5436  │ │     :5433       │
└──────────┘ └─────────────────┘
```

## 🚀 Services

### 1. **Auth Service** (Port: 5001)
- **Database**: PostgreSQL
- **Features**:
  - User registration with roles (admin/supervisor/employee)
  - JWT authentication and validation
  - Role-based authorization
  - Password encryption

### 2. **User Service** (Port: 5002)
- **Database**: MongoDB
- **Features**:
  - User profile management
  - Employee profile integration
  - Personal information storage

### 3. **Employee Service** (Port: 5004) - **NEW**
- **Database**: PostgreSQL
- **Features**:
  - Complete employee CRUD operations
  - Supervisor-supervisee hierarchies
  - Financial information (ABN, BSB, bank account)
  - Employee-user relationship management

### 4. **Shift Management Service** (Port: 5005) - **NEW**
- **Database**: PostgreSQL
- **Features**:
  - Comprehensive shift management
  - GPS-based check-in/check-out with radius validation
  - Automatic timezone calculation from coordinates
  - Shift types and configurations
  - Shift states (not started, started, finished)
  - Location tracking and validation
  - Replacement employee management

### 5. **Payroll Service** (Port: 5006) - **NEW**
- **Database**: PostgreSQL
- **Features**:
  - Pay period management
  - Fiscal week tracking
  - Payroll reporting foundation

### 6. **Timetracking Service** (Port: 5003)
- **Database**: PostgreSQL
- **Features**:
  - Basic time tracking
  - Work history
  - Hours calculation

### 7. **GraphQL Gateway** (Port: 3000)
- **Features**:
  - Unified API entry point
  - JWT validation across all services
  - Data aggregation from multiple microservices
  - GraphQL Playground at `/graphql`

## 🛠️ Technologies

- **Framework**: NestJS
- **Databases**: PostgreSQL (5 instances) + MongoDB
- **Authentication**: JWT with role-based access control
- **API**: GraphQL (Gateway) + REST (Microservices)
- **Containers**: Docker & Docker Compose
- **Validation**: class-validator + class-transformer
- **Geolocation**: Haversine formula for distance calculation
- **Timezone**: Automatic timezone detection from coordinates

## 📊 Database Schema

### **users** (auth-service)
```sql
- id (uuid)
- email (unique)
- password (encrypted)
- firstName, lastName
- role (admin|supervisor|employee)
- emailVerifiedAt
- createdAt, updatedAt
```

### **employees** (employee-service)
```sql
- id (uuid)
- userId (reference to auth-service)
- supervisorId (self-reference)
- firstName, lastName
- email, phoneNumber, address
- taxNumber, abn, bsb, account
- createdAt, updatedAt
```

### **shifts** (shift-management-service)
```sql
- id (uuid)
- shiftTypeId, employeeId
- dateStart, dateEnd
- dateStartTimezone, dateEndTimezone
- totalHours, weekdayCode, comments
- replacementId
- location, locationLat, locationLng, radius, zoom
- clockOnTime, clockOffTime
- clockOnLat, clockOnLng, clockOffLat, clockOffLng
- timezoneStart, timezoneEnd
- state (0=not started, 1=started, 2=finished)
- createdAt, updatedAt
```

### **shift_types** (shift-management-service)
```sql
- id (uuid)
- name, description
- weeklyHours
- schedule (JSON)
- createdAt, updatedAt
```

### **shift_configurations** (shift-management-service)
```sql
- id (uuid)
- shiftTypeId, employeeId
- shiftDuration
- createdAt, updatedAt
```

### **pay_periods** (payroll-service)
```sql
- id (uuid)
- startDate, endDate
- fiscalWeek
- createdAt, updatedAt
```

## 📦 Installation and Setup

### Prerequisites
- Docker
- Docker Compose
- Node.js 18+ (for local development)
- Optional: TimezoneDB API key for enhanced timezone accuracy

### 1. Clone and setup
```bash
git clone <repository-url>
cd MicroserverExample
```

### 2. Environment Configuration (Optional)
```bash
# Create .env file for timezone API
echo "TIMEZONEDB_API_KEY=your_api_key_here" > .env
```

### 3. Run with Docker (Recommended)
```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 4. Local development (Optional)
```bash
# Install dependencies for all services
npm run install:all

# Run each service individually
cd auth-service && npm run start:dev
cd user-service && npm run start:dev
cd employee-service && npm run start:dev
cd shift-management-service && npm run start:dev
cd payroll-service && npm run start:dev
cd timetracking-service && npm run start:dev
cd gateway && npm run start:dev
```

## 🔑 Environment Variables

Each service has its own environment configuration:

### Auth Service
```env
PORT=5001
DB_HOST=auth-postgres
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
MONGODB_URI=mongodb://user-mongodb:27017/user_db
```

### Employee Service
```env
PORT=5004
DB_HOST=employee-postgres
DB_PORT=5432
DB_USERNAME=employee_user
DB_PASSWORD=employee_password
DB_DATABASE=employee_db
```

### Shift Management Service
```env
PORT=5005
DB_HOST=shift-postgres
DB_PORT=5432
DB_USERNAME=shift_user
DB_PASSWORD=shift_password
DB_DATABASE=shift_db
TIMEZONEDB_API_KEY=your_api_key_here
```

### Payroll Service
```env
PORT=5006
DB_HOST=payroll-postgres
DB_PORT=5432
DB_USERNAME=payroll_user
DB_PASSWORD=payroll_password
DB_DATABASE=payroll_db
```

### Timetracking Service
```env
PORT=5003
DB_HOST=timetracking-postgres
DB_PORT=5432
DB_USERNAME=timetracking_user
DB_PASSWORD=timetracking_password
DB_DATABASE=timetracking_db
```

### Gateway
```env
PORT=3000
AUTH_SERVICE_URL=http://auth-service:5001
USER_SERVICE_URL=http://user-service:5002
TIMETRACKING_SERVICE_URL=http://timetracking-service:5003
EMPLOYEE_SERVICE_URL=http://employee-service:5004
SHIFT_SERVICE_URL=http://shift-management-service:5005
PAYROLL_SERVICE_URL=http://payroll-service:5006
JWT_SECRET=auth-jwt-secret-key-change-this-in-production
```

## 📚 API Documentation

### REST API Endpoints

#### **Auth Service** (http://localhost:5001)

**Register User**:
```bash
curl -X POST http://localhost:5001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "password123"
  }'
```

#### **Employee Service** (http://localhost:5004)

**Create Employee**:
```bash
curl -X POST http://localhost:5004/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@company.com",
    "phoneNumber": "+1234567890",
    "address": "123 Main St",
    "taxNumber": "123456789",
    "abn": "12345678901",
    "bsb": "123456",
    "account": "12345678"
  }'
```

**Get Employee by ID**:
```bash
curl http://localhost:5004/employees/{employee-id}
```

**Assign Supervisor**:
```bash
curl -X POST http://localhost:5004/employees/{employee-id}/assign-supervisor/{supervisor-id}
```

#### **Shift Management Service** (http://localhost:5005)

**Create Shift**:
```bash
curl -X POST http://localhost:5005/shifts \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "employee-uuid",
    "shiftTypeId": "shift-type-uuid",
    "dateStart": "2025-08-06T09:00:00Z",
    "dateEnd": "2025-08-06T17:00:00Z",
    "totalHours": 8,
    "location": "Main Office",
    "locationLat": 37.7749,
    "locationLng": -122.4194,
    "radius": 100,
    "zoom": 16
  }'
```

**Clock-in to Shift**:
```bash
curl -X PATCH http://localhost:5005/shifts/{shift-id}/clock \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 37.7749,
    "lng": -122.4194,
    "type": "clock_on",
    "timezone": "America/Los_Angeles"
  }'
```

**Clock-out from Shift**:
```bash
curl -X PATCH http://localhost:5005/shifts/{shift-id}/clock \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 37.7749,
    "lng": -122.4194,
    "type": "clock_off",
    "timezone": "America/Los_Angeles"
  }'
```

**Get Today's Shift**:
```bash
curl http://localhost:5005/shifts/employee/{employee-id}/today
```

**Get Employee Shifts with Filters**:
```bash
curl "http://localhost:5005/shifts/employee/{employee-id}?dateFrom=2025-08-01&dateTo=2025-08-31&page=1&limit=10"
```

#### **Payroll Service** (http://localhost:5006)

**Create Pay Period**:
```bash
curl -X POST http://localhost:5006/pay-periods \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-08-01",
    "endDate": "2025-08-15",
    "fiscalWeek": 32
  }'
```

### GraphQL Gateway (http://localhost:3000/graphql)

The GraphQL Gateway provides a unified API that aggregates data from all microservices. Access the GraphQL Playground at http://localhost:3000/graphql for interactive queries.

## 🔐 Authentication & Authorization

### Role-Based Access Control
The system implements a hierarchical role-based access control:

- **Admin**: Full access to all resources and operations
- **Supervisor**: Access to their team's data and limited management functions
- **Employee**: Access only to their own data and assigned shifts

### JWT Authentication
All protected operations require a JWT token in the header:
```
Authorization: Bearer <jwt-token>
```

The token is obtained through login or registration and contains user role information for authorization.

## 🗄️ Database Configuration

### PostgreSQL Instances

#### Auth Database (Port: 5432)
- **Service**: auth-postgres
- **Database**: auth_db
- **User**: auth_user
- **Tables**: users (with roles)

#### Employee Database (Port: 5434)
- **Service**: employee-postgres  
- **Database**: employee_db
- **User**: employee_user
- **Tables**: employees (with supervisor hierarchies)

#### Shift Management Database (Port: 5435)
- **Service**: shift-postgres
- **Database**: shift_db
- **User**: shift_user
- **Tables**: shifts, shift_types, shift_configurations

#### Payroll Database (Port: 5436)
- **Service**: payroll-postgres
- **Database**: payroll_db
- **User**: payroll_user
- **Tables**: pay_periods

#### Timetracking Database (Port: 5433)
- **Service**: timetracking-postgres
- **Database**: timetracking_db
- **User**: timetracking_user
- **Tables**: time_entries

### MongoDB Instance

#### User Profiles (Port: 27017)
- **Service**: user-mongodb
- **Database**: user_db
- **Collections**: users (profile data)

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

## 🚀 Key Features Migrated from Laravel

### ✅ Core Business Logic
- **Role-based access control** with admin/supervisor/employee hierarchy
- **GPS-based check-in/out** with configurable radius validation
- **Automatic timezone management** calculated from GPS coordinates
- **Shift state tracking** (not started, started, finished)
- **Supervisor-employee relationships** with team management
- **Financial information** storage (ABN, BSB, bank accounts)
- **Flexible shift configurations** with JSON-based scheduling

### ✅ Advanced Features
- **Haversine formula** for accurate distance calculations
- **Timezone conversion** for local time display
- **Replacement employee** management for shift coverage
- **Pay period tracking** for payroll integration
- **Location validation** with map zoom levels
- **Multi-database architecture** for service isolation

### ✅ Security & Performance
- **JWT authentication** with role claims
- **Data validation** with class-validator
- **Database transactions** for data integrity
- **Error handling** with proper HTTP status codes
- **Pagination** for large data sets
- **CORS configuration** for cross-origin requests

## 🔄 Data Migration from Laravel

To migrate existing data from the Laravel application:

1. **Export data** from the Laravel MySQL/PostgreSQL database
2. **Map table structures** to the new microservice entities
3. **Create migration scripts** for each service
4. **Validate data integrity** across service boundaries
5. **Test role-based access** with migrated user data

## 📊 Monitoring & Observability

The system is designed for production monitoring:

- **Health checks** available on each service
- **Docker container** status monitoring
- **Database connection** health validation
- **Structured logging** for troubleshooting
- **Error tracking** with proper exception handling

## 📝 Next Steps

- [ ] Implement GraphQL resolvers in the gateway
- [ ] Add comprehensive unit and integration tests
- [ ] Implement circuit breakers for fault tolerance
- [ ] Add centralized logging with ELK stack
- [ ] Create monitoring dashboards with Grafana
- [ ] Implement caching strategies with Redis
- [ ] Add API rate limiting
- [ ] Create web dashboard for shift management
- [ ] Implement real-time notifications
- [ ] Add shift scheduling automation