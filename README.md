# Analytics Dashboard

A full-stack analytics dashboard application that tracks and visualizes user interactions and button clicks in real-time.

## Implementation Details

### Frontend (React)
- Modern React application with hooks and functional components
- Real-time analytics visualization using charts
- Features implemented:
  - User analytics tracking
  - Total hits counter
  - Timestamp logging for visits
  - Button click analytics
  - Interactive buttons for testing
- Performance optimizations:
  - Lazy loading for charts
  - Memoized data processing
  - Skeleton loading states
  - Accessibility improvements

### Backend (Node.js/Express)
- RESTful API endpoints for:
  - User analytics
  - Visit tracking
  - Button click tracking
- MongoDB integration for data persistence
- Real-time data updates

## How to Run the Application

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd AnalyticsApp-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:3000

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd analytics-dashboard-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend application:
   ```bash
   npm start
   ```
   The application will open in your browser at http://localhost:3001

## Features
- Real-time analytics tracking
- Interactive dashboard with multiple views
- Button click tracking with visual analytics
- User visit history
- Modern, responsive design
- Accessibility support
- Loading states and error handling

## Technical Stack
- Frontend: React, CSS3
- Backend: Node.js, Express
- Database: MongoDB
- Charts: React Charts
- Icons: Font Awesome
- State Management: React Hooks
