# Sari-Sari Store in Atlag: Order & Pickup Application

A modern, full-stack ordering system designed for local businesses. The application facilitates product browsing, cart management, and scheduled store pickups with a dedicated administrative dashboard for inventory and order queue management.

## Project Architecture

The system is built using a decoupled architecture:

*   **Frontend**: React (TypeScript) with Vite, styled via Tailwind CSS. State management is handled through a custom React Context provider.
*   **Backend (Local)**: Node.js with Express, providing a RESTful API for products, orders, and user sessions.

## Core Features

### Customer Experience
*   **Product Catalog**: Dynamic menu with category filtering and real-time search.
*   **Cart System**: Local state-managed shopping cart with inventory validation.
*   **Pickup Scheduling**: Integrated date and time selection for store collections.
*   **Order Tracking**: Real-time status updates (Pending, Packed, Ready, Completed).
*   **Offline Mode**: Automatic fallback to LocalStorage if the primary API server is unreachable.

### Administrative Tools
*   **FIFO Queue**: Order management system sorted by submission time.
*   **Inventory Control**: CRUD operations for products and categories.
*   **User Management**: Ability to manually register or manage customer profiles.
*   **Digital Invoices**: Standardized invoice generation with print/PDF support for store records.

## Technical Stack

*   **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
*   **Backend**: Node.js
*   **API Protocol**: REST / JSON

## Installation

1.  **Clone the repository**:
    ```bash
    cd sari-sari-store-in-atlag-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Development Workflow

To run the application locally, you must initiate both the backend and frontend servers.

### 1. Start the Backend API
The backend runs on port 3001. It handles the in-memory data persistence and API logic.
```bash
npm run server
```

### 2. Start the Frontend Development Server
The frontend runs on port 3000 and is configured to proxy `/api` requests to the backend.
```bash
npm run dev
```

### 3. Accessing the Application
*   **Frontend**: http://localhost:3000