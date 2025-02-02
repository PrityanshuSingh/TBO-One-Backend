# TBO-One - AI Powered Travel CRM Backend

**TBO-One Backend** is the server-side component of the AI-powered travel CRM designed for travel agents. It provides robust API endpoints for managing travel packages, customer relationships, campaign automation, and AI-powered recommendations. Built using Node.js with Express.js, MongoDB, and integrated AI/ML services, it ensures seamless data handling, security, and scalability.

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation and Setup](#installation-and-setup)
- [Fork and Contribution](#fork-and-contribution)
- [API Documentation](#api-documentation)
- [Future Enhancements](#future-enhancements)
- [Acknowledgements](#acknowledgements)

---

## Introduction

TBO-One Backend is the core system that powers the TBO-One platform, handling data storage, business logic, and AI integrations. It offers:

- **Efficient travel package management** with dynamic updates from TBO’s inventory.
- **AI-driven customer insights** for personalized recommendations and travel planning.
- **Automated campaign management** for social media, email, and WhatsApp communications.
- **Secure authentication and user role management** ensuring data privacy and access control.
- **Scalability and performance optimization** to support multiple travel agents efficiently.

This README provides a comprehensive guide for developers and contributors to set up and extend the backend functionality.

---

## Features

### Core Functionalities

- **Travel Package Management**  
  - Create, update, and delete travel packages.
  - Fetch TBO’s live inventory and synchronize package details dynamically.

- **AI-Powered Recommendations**  
  - Machine learning-based customer profiling and travel package suggestions.
  - Integration with Python Flask API serving AI models.

- **User Authentication & Access Control**  
  - JWT-based authentication for secure access.
  - Role-based access control (RBAC) for travel agents, admins, and marketing specialists.

- **Campaign & Marketing Automation**  
  - Automate email, SMS, and WhatsApp-based customer communication.
  - AI-assisted content generation for marketing campaigns.

- **Social Media API Integration**  
  - Enables scheduled and automated travel package promotions on social platforms.

- **Real-time Notifications & Alerts**  
  - Push notifications for customer inquiries, package updates, and promotional campaigns.

- **Secure and Scalable Architecture**  
  - Data encryption, secure API endpoints, and compliance with GDPR & CCPA standards.
  
---

## Tech Stack

- **Backend Framework:** Node.js with Express.js – Handles API requests and business logic.
- **Database:** MongoDB – Stores travel packages, user data, and campaign history.
- **Authentication:** JWT – Ensures secure user authentication.
- **AI/ML Integration:** Flask with scikit-learn – Processes AI-driven recommendations.
- **Message Queues:** Redis – Optimizes asynchronous tasks and notifications.
- **Third-Party Integrations:** Twilio (WhatsApp/SMS), SendGrid (Emails), TBO Inventory API.

---

## Installation and Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/PrityanshuSingh/TBO-One-Backend.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd TBO-One-Backend
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Set Up Environment Variables:**
   - Create a `.env` file in the root directory and configure it as follows:
     ```
     PORT=5000
     MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
     JWT_SECRET=YOUR_SECRET_KEY
     TBO_API_KEY=YOUR_TBO_API_KEY
     REDIS_URL=YOUR_REDIS_CONNECTION_STRING
     FLASK_AI_SERVICE_URL=YOUR_AI_SERVICE_URL
     ```

5. **Start the Backend Server:**
   ```bash
   npm start
   ```

6. **Test API Endpoints:**
   - Use Postman or any API client to interact with `http://localhost:5000/api`

---

## Fork and Contribution

1. **Fork the Repository** on GitHub.
2. **Clone Your Fork:**
   ```bash
   git clone https://github.com/your-username/TBO-One-Backend.git
   ```
3. **Create a New Branch:**
   ```bash
   git checkout -b feature/my-new-feature
   ```
4. **Make Your Changes and Commit:**
   ```bash
   git commit -m "Added feature XYZ"
   ```
5. **Push to Your Fork and Submit a PR:**
   ```bash
   git push origin feature/my-new-feature
   ```

---

## API Documentation

- **Authentication:**  
  - `POST /api/auth/register` – Register a new user.
  - `POST /api/auth/login` – Authenticate user and return JWT.
  
- **Travel Package Management:**  
  - `GET /api/packages` – Retrieve all packages.
  - `POST /api/packages` – Create a new package.
  - `PUT /api/packages/:id` – Update a package.
  - `DELETE /api/packages/:id` – Delete a package.

- **AI Recommendations:**  
  - `POST /api/recommendations` – Get AI-driven travel suggestions.

- **Campaign Management:**  
  - `POST /api/campaigns` – Create a marketing campaign.
  - `GET /api/campaigns` – Retrieve all campaigns.
  
For a detailed API reference, check the [Postman Collection](https://tinyurl.com/5n6phsyc).

---

## Future Enhancements

- **Admin Dashboard for Monitoring & Analytics**  
  - Implement a graphical admin panel for real-time data visualization.

- **AI Chatbot for Customer Queries**  
  - Provide instant AI-based responses to customer inquiries.

- **Advanced Reporting & Insights**  
  - Generate business insights based on user activity and package trends.

- **Multi-Language & Multi-Currency Support**  
  - Expand global usability by offering multiple language and currency options.

---

## Acknowledgements

TBO-One Backend is developed by team Veltrix during VoyageHack2.0 Hackathon, including contributors: [Prityanshu Singh](https://github.com/PrityanshuSingh), [Prakash Pramanick](https://github.com/prakash2003pramanick), and [Amaldeep Patra](https://github.com/amaldeeppatra). Special thanks to open-source libraries and APIs powering this project.

Happy Coding & Safe Travels!

