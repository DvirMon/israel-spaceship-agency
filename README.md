# 🚀 IISA Front-End Take-Home Assignment

Welcome to the official take-home project for the **Israeli Imaginary Space Agency (IISA)** recruitment initiative. This project includes a responsive public **registration landing page** and a **management dashboard** for candidate data.

---

## 🌐 Project Overview

This app supports public registration for the first 100% Israeli space flight 🚀 and allows recruiters to view and manage candidate submissions in real-time.

---

## 🛠 Installation and Setup

### 1. Clone the repo

```bash
git clone https://github.com/DvirMon/israel-spaceship-agency.git
cd israel-spaceship-agency
```

### 2. Configure Environment

Create a `.env` or `environment.ts` file for:

- **Firebase configuration** (API keys, project ID, etc.)
- **OpenCageData API Key** for geolocation

### 3. Install dependencies

```bash
npm install
```

### 4. Run locally

```bash
ng serve
```

App will be available at `http://localhost:4200`

> To navigate to the dashboard, go to: `http://localhost:4200/dashboard`

---

## 📦 Folder Structure

```
src/
├── app/
│   ├── core/               # Services, guards, models
│   ├── shared/             # Shared UI components
│   ├── features/
│   │   ├── landing/        # Landing page
│   │   ├── register/       # Register form
│   │   └── dashboard/      # Admin dashboard
│   └── app.ts
```

## 🧩 Tech Stack

- **Angular 20** (TypeScript)
- **Angular Material**
- **Reactive Forms**
- **LocalStorage**
- **Firebase**

---

## ✨ Highlights

- Fully **zoneless OnPush-based** app
- Fully **declarative using RxJS and Signals**
- Full **responsive** design for desktop and mobile
- Real **geolocation querying** via OpenCage API  
- Real **image uploads stored** via Firebase Storage

---

## 🎯 Features

### Part 1: Landing Page

- Responsive personal info form (name, email, phone, etc.)
- Free-text fields (hobbies, motivation)
- Profile image upload (JPEG/PNG)
- Allows edits within 3 days (via local/session storage)
- Fully responsive for desktop and mobile

### Part 2: Management Dashboard

- Candidate list (table or card view)
- Candidate age breakdown graph
- Candidate map (location)
- Visit-to-registration conversion stats
- Search, filter, and individual profile view
- Navigation between candidates
- Live updates via Firestore

---
