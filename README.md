# Product & Category Management System

This is a full-stack web application built with Laravel, Vue 3, Inertia.js, and Tailwind CSS. It features a responsive UI, client-side pagination, sorting, search filtering, form validation using Zod, and asynchronous data loading.

## Prerequisites

Before setting up the project, ensure you have the following installed on your system:
- **PHP** (>= 8.2)
- **Composer**
- **Node.js** (>= 18.x) & **npm**

## Setup & Installation Instructions

Follow these steps to get the project running locally:

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd elearn-assessment
```

### 2. Install PHP Dependencies
Install the required Laravel packages using Composer:
```bash
composer install
```

### 3. Install Node.js Dependencies
Install the required frontend packages (Vue, Tailwind, Inertia, etc.):
```bash
npm install
```

### 4. Configure the Environment
Duplicate the example environment file to create your local `.env`:
```bash
cp .env.example .env
```
Generate your application encryption key:
```bash
php artisan key:generate
```

### 5. Database Setup
This project uses **SQLite** for the database. For convenience, the `database.sqlite` file is included directly in the repository so you don't have to manually configure a connection.

To ensure your database schema is up-to-date and populated with initial dummy data, run the migrations and seeders:
```bash
php artisan migrate:fresh --seed
```

### 6. Run the Development Servers
To run this application, you will need to start both the Laravel backend server and the Vite frontend build tool. **Open two separate terminal windows.**

**Terminal 1 (Backend):**
```bash
php artisan serve
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### 7. Access the Application
Once both servers are running, open your web browser and navigate to:
[http://localhost:8000](http://localhost:8000)

## Features Included
- **Products & Categories Management:** Complete Create, Read, Update flows.
- **Client-Side Data Tables:** Instant search, column sorting, and pagination without full page reloads.
- **Inertia Lazy Loading:** Smooth skeleton loaders while data is fetched asynchronously.
- **Advanced Validation:** Client-side form validation using Zod schemas matching Laravel backend rules.
- **Responsive Design:** Optimized for mobile, tablet, and desktop views utilizing Shadcn UI components.