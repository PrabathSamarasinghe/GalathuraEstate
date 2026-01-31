# Galathura Estate - Backend API

GraphQL backend for the Galathura Estate Tea Factory Management System built with Apollo Server, Prisma, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js
- **API**: Apollo Server 4 (GraphQL)
- **ORM**: Prisma 5
- **Database**: PostgreSQL
- **Authentication**: JWT with bcrypt
- **Language**: TypeScript

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file (or edit the existing one):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/galathura_estate?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=4000
```

Replace `username` and `password` with your PostgreSQL credentials.

### 3. Create Database

Create a PostgreSQL database:

```sql
CREATE DATABASE galathura_estate;
```

### 4. Run Migrations

Generate and apply database migrations:

```bash
npx prisma migrate dev --name init
```

### 5. Seed the Database

Populate the database with initial data:

```bash
npm run prisma:seed
```

This creates:
- An admin user (`admin@galathura.lk` / `admin123`)
- System settings
- 5 sample employees
- 3 months of transaction data
- Made tea stock

### 6. Start the Server

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

The GraphQL server will be running at `http://localhost:4000`

## GraphQL Playground

Visit `http://localhost:4000` in your browser to access the Apollo Sandbox for testing queries and mutations.

## API Overview

### Authentication

Login to get a JWT token:

```graphql
mutation {
  login(username: "admin@galathura.lk", password: "admin123") {
    token
    user {
      id
      username
      fullName
    }
  }
}
```

Include the token in subsequent requests:

```json
{
  "Authorization": "Bearer your-jwt-token"
}
```

### Key Queries

```graphql
# Get all employees
query {
  employees {
    id
    fullName
    department
    status
  }
}

# Get dashboard KPIs
query {
  dashboardKPIs {
    todayAttendance {
      presentCount
      totalWages
    }
    financialSummary {
      monthExpenses
      monthIncome
      netProfit
    }
    alerts {
      type
      message
      severity
    }
  }
}

# Get profit & loss statement
query {
  profitLossStatement(dateFrom: "2025-01-01", dateTo: "2025-01-31") {
    totalIncome
    grossProfit
    netProfit
    netProfitMargin
  }
}
```

### Key Mutations

```graphql
# Create employee
mutation {
  createEmployee(input: {
    fullName: "John Doe"
    nicNumber: "123456789V"
    department: FIELD
    designation: FIELD_WORKER
    employmentType: PERMANENT
    joinDate: "2025-01-01"
    status: ACTIVE
    payType: DAILY
    rate: 1500
  }) {
    id
    fullName
  }
}

# Create transaction
mutation {
  createTransaction(input: {
    date: "2025-01-15"
    type: EXPENSE
    category: "FUEL_POWER"
    description: "Fuel for generator"
    amount: 25000
    paymentType: CASH
  }) {
    id
    amount
  }
}
```

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data script
├── src/
│   ├── index.ts         # Apollo Server entry point
│   ├── schema/
│   │   └── typeDefs.ts  # GraphQL type definitions
│   └── resolvers/
│       ├── index.ts     # Resolver exports
│       ├── auth.ts      # Authentication resolvers
│       ├── employee.ts  # Employee CRUD
│       ├── attendance.ts # Attendance management
│       ├── transaction.ts # Financial transactions
│       ├── inventory.ts  # Inventory management
│       ├── dashboard.ts  # Dashboard KPIs
│       └── system.ts     # System settings
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed the database |
| `npm run prisma:studio` | Open Prisma Studio (GUI for database) |

## Database Management

### View Data

```bash
npx prisma studio
```

### Reset Database

```bash
npx prisma migrate reset
```

### Create Migration

```bash
npx prisma migrate dev --name migration_name
```

## Connecting Frontend

The frontend is configured to connect to `http://localhost:4000`. Make sure the backend is running before starting the frontend.

In the frontend:

```bash
cd frontend
npm install
npm run dev
```

## Default Credentials

| User | Email | Password |
|------|-------|----------|
| Admin | admin@galathura.lk | admin123 |

## License

Private - Galathura Estate
