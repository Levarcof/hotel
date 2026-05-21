# 🏨 GrandStay - Full-Stack Hotel & Hospitality Management System

A premium, production-ready hospitality platform built with **Next.js 14 (App Router)**, **MongoDB**, and **Tailwind CSS**. This application bridges the gap between customer-facing hospitality experiences and robust internal business administration. 

It features an elegant client storefront for room/table bookings and food ordering, seamlessly integrated with a high-fidelity **Admin Dashboard** for complete business analytics, real-time inventory management, and revenue tracking.

---

## 🔥 Key Features

### 👤 Customer-Facing Portal
*   **Dynamic Food Menu & Ordering:** Browse active culinary menus with instant item customization and direct cart-to-order pipelines.
*   **Smart Room Booking:** Real-time checking of room categories, pricing tiers, and dynamic availability slots.
*   **Interactive Table Reservation:** Seamless table booking engine preventing double-reservations.
*   **Intuitive UI/UX:** Designed with a responsive, modern glassmorphic look optimized for mobile, tablet, and desktop views.

### 👑 Enterprise Admin Dashboard (Owner-Only Access)
*   **Unified Business Analytics:** Live tracking of **Total Revenue**, **Sales Volume**, and category-specific financial insights.
*   **Inventory Control Center:** Full CRUD operations to dynamically add, edit, or remove rooms, dining tables, and food menu items.
*   **Live Order & Fulfillment Engine:** Real-time state management for updating food preparation states (e.g., Pending, Cooking, Delivered).
*   **Financial & Booking Ledgers:** Centralized visibility over payment verification logs, comprehensive room check-in schedules, and table reservation timelines.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Key Responsibility |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14** (App Router) | Server-Side Rendering (SSR), API Routing, and optimized asset delivery. |
| **Database** | **MongoDB** + **Prisma / Mongoose** | Storing complex relational documents (Users ↔ Bookings ↔ Orders). |
| **Styling** | **Tailwind CSS** | Crafting a cohesive, responsive premium aesthetic across dashboards. |
| **State Management**| React Context / Hooks | Preserving smooth user actions, shopping carts, and UI context. |
| **Security** | Role-Based Authorization | Strict middleware locking admin endpoints exclusive to the owner. |

---

## 🚀 Installation & Local Setup

### Prerequisites
*   Node.js v18.x or higher
*   MongoDB database instance (Local or MongoDB Atlas cluster)

### Step-by-Step Deployment

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/levarcof/hotel.git](https://github.com/levarcof/hotel.git)
   cd hotel
