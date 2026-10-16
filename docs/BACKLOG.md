# 🗂️ EduTech Starter — Product Engineering Backlog

> Grouped by milestone and ordered by architectural dependency. Follows `docs/REQUIREMENTS.md`.

---

## 🏆 Milestone 1: Core Academic Engine & White-Label (Completed)
- **EDU-01**: Academic Terms, Cohorts, Courses & Live Meeting Links (`C1`, `C3`)
- **EDU-02**: White-Label Dynamic Branding Engine (`/api/v1/institute/bootstrap`)
- **EDU-03**: Payment Receipts Audit Pipeline (`P1`, `P2`)
- **EDU-04**: Secure Video Streaming & Token Signed URLs (`V1`)
- **EDU-05**: Progress Tracking & Automatic Certificate Issuance (`V2`, `V3`)
- **EDU-06**: DevOps, Dockerization, Turnkey Setup & Environment config

---

## 🏆 Milestone 2: Learning Workspace & Profile Hub (Completed)
- **EDU-07**: Interactive Lesson Notes with Timestamp Sync (`A5`)
- **EDU-08**: Trainee Academic Profile Hub & Credential Showcase (`A5`)

---

## 🏆 Milestone 3: Localization & Automated Gateways (Completed)
- **EDU-09**: Official French Academic Certificate Default with Verification (`P7`)
- **EDU-10**: SATIM / CIB Automated Payment Gateway & Webhook Auto-Enrollment (`P3`, `P6`)

---

## 🏆 Milestone 4: Full Project Specification Alignment (Completed)

### Ticket EDU-11: Course Reviews & Dynamic Catalog Search/Filter Engine
- **Requirement IDs**: `C2`, `C4`
- **Input**: Search query (`q`), category ID (`category`), price range (`price_min`, `price_max`), rating filter (`rating`), review payload (`course_id`, `rating`, `comment`).
- **Expected Output**: Filtered course catalog; persisted review linked to trainee and course; course average rating recalculated.
- **Acceptance Criteria**:
  1. Only enrolled students with approved status can review a course.
  2. Max 1 review per student per course (unique constraint).
  3. Rating must be an integer between 1 and 5.
  4. Search and filters return matching results under 200ms.

### Ticket EDU-12: Consultations & 1-on-1 Specialist Booking Engine
- **Requirement IDs**: `K1`, `K2`, `K3`, `K4`, `K6`
- **Input**: Specialist consultation types, available datetime slots, booking request with trainee details.
- **Expected Output**: Reserved booking with 10-minute hold lock; payment confirmation; assigned meeting link (Google Meet / Zoom); cancellation policy handling.
- **Acceptance Criteria**:
  1. Two students cannot book the same slot (concurrency safe).
  2. Unpaid slot automatically released after 10 minutes.
  3. Specialist meeting link accessible upon booking confirmation.
  4. Trainee can view upcoming and past consultations in their dashboard.

### Ticket EDU-13: Electronic PDF Invoices & Billing History
- **Requirement IDs**: `P7`, `A5`
- **Input**: Approved payment receipt or online SATIM transaction ID.
- **Expected Output**: Unique invoice number (e.g., `INV-2026-XXXX`); downloadable French/Arabic PDF invoice; invoice ledger in Profile Hub.
- **Acceptance Criteria**:
  1. Every approved purchase generates an immutable invoice record.
  2. Invoice PDF includes academy tax/commercial details, student name, item title, amount in DZD, and payment method.
  3. Student can download their invoice anytime from the mobile app and web.

### Ticket EDU-14: Store Compliance: Account Deletion & Video Player Watermark
- **Requirement IDs**: `A6`, `V4`
- **Input**: Authenticated deletion request; streaming session with learner credentials.
- **Expected Output**: Safe user deletion and session invalidation; visible anti-piracy overlay displaying trainee ID on video playback.
- **Acceptance Criteria**:
  1. Trainee can trigger account deletion via `DELETE /api/v1/auth/account`.
  2. Mobile video player renders non-obtrusive semi-transparent watermark displaying student ID/email to deter screen recording.

### Ticket EDU-15: Promotional Discount Coupons Engine
- **Requirement IDs**: `D7`
- **Input**: Coupon code (`code`), purchase amount.
- **Expected Output**: Validated coupon applying percentage or fixed DZD discount.
- **Acceptance Criteria**:
  1. Expired or depleted coupons return informative error.
  2. Discount applied correctly to checkout total.

### Ticket EDU-16: Mobile UI Integration & Riverpod State Providers
- **Requirement IDs**: `A5`, `C2`, `C4`, `K1`, `K2`, `P7`
- **Input**: User interactions on Flutter client.
- **Expected Output**: Responsive mobile screens for Consultations, Reviews, Invoice downloads, and Watermark video player.
- **Acceptance Criteria**:
  1. Consultations tab / navigation destination in mobile app.
  2. Invoices list in Profile Hub with PDF download trigger.
  3. 0 static analysis errors (`dart analyze lib`).
