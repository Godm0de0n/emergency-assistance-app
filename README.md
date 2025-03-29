# Emergency Assistance Application

A web-based emergency assistance application with SOS alerts, location tracking, and video recording capabilities.

## Features

- **SOS Alert System**: Send emergency alerts with your current location
- **Video Recording**: Record emergency videos and save them for evidence
- **Location Tracking**: Automatically captures your current location for emergency services
- **Phone Number Registration**: Register your emergency contact information

## Technology Stack

- **Frontend**: React, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Express
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod validation
- **Storage**: In-memory database (for demonstration purposes)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
   ```
   git clone https://github.com/Godm0de0n/emergency-assistance-app.git
   cd emergency-assistance-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

## Usage

1. Enter your phone number in the contact information form
2. Use the SOS button to send emergency alerts with your location
3. Use the video recorder to capture evidence during emergencies

## Project Structure

- `/client`: Frontend React application
- `/server`: Backend Express server
- `/shared`: Shared type definitions and schemas

## Deployment

This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the project configuration
3. No additional build settings are required as the project includes a `vercel.json` file
4. The application will be built and deployed automatically

## License

This project is open source and available under the MIT License.

## Created By

Abhisek