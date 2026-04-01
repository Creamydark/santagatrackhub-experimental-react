
<img width="1920" height="951" alt="screencapture-localhost-5173-login-2026-04-01-16_21_43" src="https://github.com/user-attachments/assets/2f0b53de-aa59-47f8-9643-98f914ebeb11" />





Here is a professional, comprehensive `README.md` template tailored perfectly for your repository. It incorporates your system architecture, technology stack, and core modules. 

You can copy this raw markdown and paste it directly into your GitHub repository's `README.md` file.

***

```markdown
# 📍 SantagaTrackHub

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Arduino](https://img.shields.io/badge/-Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

**SantagaTrackHub** is a web-based automated barangay management and real-time IoT vehicle tracking system designed to streamline operational logistics and digitize health center records for Barangay Santiago.

---

## 🚀 System Modules

The platform is divided into four strictly compartmentalized modules to ensure role-based security and operational efficiency:

* **🏥 Health Management Module:** A dedicated digital environment for health workers to securely manage patient demographic information and vaccination records, featuring instant file retrieval via QR code scanning.
* **👥 User Management Module:** A central administrative hub enforcing Role-Based Access Control (RBAC) to securely manage accounts for health workers, drivers, and barangay officials.
* **🚗 Vehicle Management Module:** An automated dispatch logging system where drivers present unique QR codes to authenticate identity and timestamp vehicle check-out/check-in times.
* **📡 Vehicle Tracking Module:** The core IoT integration point that renders live GPS coordinates—transmitted via a GSM network from onboard Arduino hardware—onto an interactive web map for real-time fleet monitoring.

---

## 🛠️ Technology Stack

**Frontend**
* React.js
* Tailwind CSS
* React Router DOM

**Backend & Database**
* Node.js / Express.js (REST API)
* MySQL (Central Relational Database)
* JSON Web Tokens (JWT) for Authentication

**IoT Hardware**
* Arduino Uno R3
* Neo-6M GPS Module (NMEA Coordinate Processing)
* SIM800L GSM Module (HTTP POST Data Transmission)

---

## ⚙️ Installation and Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MySQL](https://www.mysql.com/) Server
* [Arduino IDE](https://www.arduino.cc/en/software)

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/SantagaTrackHub.git](https://github.com/yourusername/SantagaTrackHub.git)
cd SantagaTrackHub
```

### 2. Backend Setup
```bash
cd backend
npm install
```
* Create a `.env` file in the `backend` directory and configure your environment variables:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=yourpassword
    DB_NAME=santagatrackhub_db
    JWT_SECRET=your_super_secret_key
    ```
* Import the provided database schema (`database.sql`) into your MySQL server.
* Start the backend server:
    ```bash
    npm start
    ```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
* Start the React development server:
    ```bash
    npm run dev
    ```
* The application will be running at `http://localhost:3000`.

### 4. Hardware Setup
1.  Open the `hardware/santaga_tracker.ino` file in the Arduino IDE.
2.  Wire the Neo-6M and SIM800L modules to the Arduino according to the provided schematic diagram.
3.  Update the `SERVER_URL` variable in the code to point to your backend's IoT webhook endpoint.
4.  Flash the code to the Arduino Uno R3.

---

## 🔒 Security & Architecture

This system utilizes a highly decoupled architecture. The React frontend handles all user interactions and QR logic, while the backend API serves as the secure bridge. The IoT hardware bypasses the frontend entirely, transmitting live coordinates directly to the backend API via HTTP POST requests, ensuring continuous tracking even if the administrative dashboard is closed.

---

## 📝 License
This project is developed as an academic capstone requirement. All rights reserved by the developers.
```

***

### 💡 Quick Tips for GitHub:
* Make sure you replace `https://github.com/yourusername/SantagaTrackHub.git` with your actual repository link.
* If you end up putting your system architecture diagram into your repository (like in an `/assets` folder), you can display it right in the README by adding `![System Architecture](./assets/architecture.png)` underneath the "System Modules" section!
