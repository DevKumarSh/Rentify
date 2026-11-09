# RentiFy – Room Rental Platform

A modern, broker-free room rental discovery and management platform designed specifically for students and working professionals to find affordable rooms, and for property owners to list, manage, and verify vacancies.

---

## 🌟 Key Features

- **Zero Brokerage**: Direct connection between room seekers and verified property owners.
- **Role-Based Portals**:
  - **Room Seeker (`ROLE_SEEKER`)**: Browse, multi-filter search, save favorites, send structured enquiries, and write reviews.
  - **Room Owner (`ROLE_OWNER`)**: Post room listings, manage photos, update availability (`AVAILABLE` / `RENTED`), and respond to tenant enquiries.
  - **Administrator (`ROLE_ADMIN`)**: Verify listings, handle flagged reports, moderate user accounts, and review analytics.
- **Search & Advanced Filtering**: Multi-criteria filters by city, locality, budget rent range, gender preference, room type, and furnishing.
- **Responsive Full-Screen UI**: Fluid, glassmorphic modern design with Google Fonts and Lucide icons.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 19, Vite, Vanilla CSS, React Router v7, Lucide Icons, Axios
- **Backend (Target Architecture)**: Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA
- **Database**: MySQL 8.0

---

## 🚀 Getting Started

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be running at `http://localhost:5173/`.

### 2. Platform Authentication & Seeded Super Administrator

The platform operates fully dynamically with live backend API persistence:
- **Room Seekers & Property Owners**: Create dynamic accounts directly via `/register`.


- **Platform Super Admin**: Dev Sharma (`devsharmakumar74@gmail.com` / `password123`)

---

## 📄 Documentation

For full product requirements, database schema, entity models, and API specifications, refer to [PRD.md](./PRD.md).


### Database & API Notes
- Backend configured with Spring Data JPA and H2/MySQL.

- Default test port: 8081
