<h1>Issue Tracker</h1>

The **Issue Tracker** is a web application designed to help users manage and track issues efficiently. It allows users to create, update, delete, and view issues, with features like filtering, searching, and user authentication.

## Features
### User Authentication:
- Register and log in to the application.
- Only authenticated users can create, update, or delete issues.

### Issue Management:
- Create new issues with a title, description, and status.
- Update existing issues.
- Delete issues.
- View a list of issues with filtering and search functionality.

### Filtering and Searching:
- Filter issues by status (OPEN, IN_PROGRESS, CLOSED).
- Search issues by title.
- Filter issues by creation or update date.

### Responsive Design:
- Works seamlessly on desktop and mobile devices.

## Technologies Used
### Frontend:
- Next.js
- React
- Tailwind CSS
- Radix UI

### Backend:
- Next.js API Routes
- Prisma (ORM)
- MySQL (Database)

### Authentication:
- NextAuth.js

### Validation:
- Zod

## Prerequisites
Before running the project, ensure you have the following installed:
- Node.js (v18 or higher)
- MySQL (or any other database supported by Prisma)
- Git (optional)

## Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/issue-tracker.git
   cd issue-tracker
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up the Database**
   - Create a MySQL database (e.g., issue-tracker).
   - Update the .env file with your database credentials:
     ```bash
     DATABASE_URL="mysql://root:yourpassword@localhost:3306/issue-tracker"
     NEXTAUTH_URL="http://localhost:3000"
     NEXTAUTH_SECRET="your-secret-key"
     ```
   - Run Prisma migrations to set up the database schema:
     ```bash
     npx prisma migrate dev --name init
     ```

  4. **Run the Application Start the development server:**
     ```bash
     npm run dev
     ```

## Folder Structure
```
issue-tracker/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── issues/
│   │   └── register/
│   ├── components/
│   ├── issues/
│   ├── login/
│   ├── register/
│   └── layout.tsx
├── prisma/
│   └── schema.prisma
├── public/
├── styles/
├── .env
├── .gitignore
├── package.json
├── README.md
└── tailwind.config.js
```

## API Endpoints

### Authentication
- **POST /api/auth/register** : Register a new user.
- **POST /api/auth/login** : Log in a user.

### Issues
- **GET /api/issues** : Fetch all issues for the logged-in user.
- **POST /api/issues** : Create a new issue.
- **GET /api/issues/[id]** : Fetch a specific issue by ID.
- **PATCH /api/issues/[id]** : Update a specific issue by ID.
- **DELETE /api/issues/[id]** : Delete a specific issue by ID.

## Acknowledgments

- **Next.js** for the framework.
- **Prisma** for database management.
- **NextAuth.js** for authentication.
- **Tailwind CSS** for styling.
