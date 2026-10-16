# 📋 Online Academy App — Requirements Specification

> **Source of Truth** based on `docs/full_project.md`.

---

## 1. Project Overview & Scope
- **Target Platform**: Mobile App (Flutter for iOS & Android), Web Application (React 19), Backend REST API (Laravel 11 + SQLite/PostgreSQL).
- **Core Value Proposition**: Students browse, purchase, and securely stream recorded courses, book paid 1-on-1 consultations with specialists, pay via multi-channel gateways (Cards, Wallets, SATIM/CIB), and manage their academic profile with verified diplomas and electronic invoices.

---

## 2. User Roles & Capabilities
| Role | Capabilities |
| :--- | :--- |
| **Guest** | Browse public catalog, search/filter courses, watch teasers/free previews, view consultation specialists. |
| **Student / Trainee** | Authenticate, buy courses, stream encrypted video with learner ID watermark, submit lesson notes, earn certified diplomas, book & pay for consultation slots, receive meeting links, download PDF invoices. |
| **Instructor** | Host courses, manage cohort announcements with Google Meet/Zoom links, conduct consultations. |
| **Administrator** | Manage catalog, consultation availability schedules, audit payments/receipts, issue refunds, view financial dashboards, manage coupons and enrollments. |

---

## 3. Functional Requirements (Matrix)

### 4.1 Accounts & Identity
- **A1**: Sign up and log in with email and password; session persistence.
- **A2**: Sign up and log in with phone and OTP (5-minute expiry, max 5 attempts/hour).
- **A3**: Social sign-in scaffolding (Google & Apple ID).
- **A4**: Password reset with OTP / secure reset token.
- **A5**: Student profile hub (courses, upcoming consultations, certificate hub, invoice history).
- **A6**: In-app account deletion (`DELETE /api/v1/auth/account`) satisfying App Store & Google Play compliance.

### 4.2 Courses & Video Streaming
- **C1**: Catalog with categories and pagination.
- **C2**: Fast search and filtering by category, price range, and minimum rating.
- **C3**: Course details: teaser video, syllabus/modules, price, instructor bio, verified reviews.
- **C4**: Reviews & ratings (1–5 stars) submitted strictly by enrolled students (1 review per student per course).
- **V1**: Secure playback authorization (signed URLs, token verification, 403 on invalid tokens).
- **V2**: Resume playback position and toggle lesson completion.
- **V3**: Course progress percentage calculation matching completed lessons.
- **V4**: Anti-capture measures and visible dynamic watermark displaying Student ID / Email.

### 4.3 Consultations & Appointments
- **K1**: Consultation types with title, description, duration (minutes), price, and specialist info.
- **K2**: Availability calendar with selectable time slots; strict double-booking prevention.
- **K3**: 10-minute temporary slot hold during checkout before automatic release if unpaid.
- **K4**: Meeting link integration (Zoom / Google Meet URL).
- **K5**: Consultation booking reminders and notifications.
- **K6**: Reschedule and cancellation policy.

### 4.4 Payments & Invoicing
- **P1**: Hosted / Tokenized Cards (Visa, Mastercard, Mada, CIB/Edahabia).
- **P2**: Local offline & mobile wallets (BaridiMob, CCP, InstaPay, Vodafone Cash, Fawry).
- **P3**: Automated SATIM/CIB electronic payment gateway with HMAC verification.
- **P4**: Multi-currency support (Default `DZD` / `د.ج`, plus USD).
- **P5**: Store in-app billing verification scaffolding (iOS / Android digital goods).
- **P6**: Idempotent webhook handling with replay protection.
- **P7**: Automated PDF electronic invoices with unique sequential invoice numbers and download history.
- **P8**: Administrative refunds with automatic access revocation.

### 4.5 Notifications, Marketing & Admin
- **N1**: Event-driven push notifications on purchase and booking confirmation.
- **N2**: Device token registration (`DeviceToken`) for targeted notifications.
- **D1**: Role-based access control (Admin, Instructor, Trainee).
- **D2**: Course, module, lesson, and video management.
- **D3**: Consultation type and calendar slot management.
- **D4**: Financial orders and payment receipt audit logs.
- **D5**: Sales dashboard metrics and reporting.
- **D6**: User enrollment management (manual grant or revoke).
- **D7**: Promotional discount coupons (`Coupon`) with fixed or percentage deductions and expiry dates.

---

## 4. Non-Functional Requirements
- **Internationalization**: Bilingual Arabic (RTL) and French/English (LTR) with instant toggling.
- **Security**: Sanctum token auth, password hashing, SQL injection prevention, HMAC signatures on payment webhooks.
- **Performance**: API response times under 500ms; lightweight lazy-loading in mobile client.
