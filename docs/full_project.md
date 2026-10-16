Online Academy App: Requirements, 30-Day Plan and AI Prompts
Prepared Oct 16, 2026 from a Mostaql listing: Flutter or React Native, 30 days, $2,500 to $5,000. Use it to bid on the project or as the base for your own similar build.

1. Project summary
   Goal: a mobile app (Android and iOS) where students of an online academy browse and buy recorded courses, watch them securely, book paid consultations, and pay with several methods. A simple web admin dashboard manages everything.
   In scope: accounts, course catalog and player with progress, consultation booking, multi-method payments with invoices, push notifications, admin dashboard, publishing to Google Play and the App Store, full source code, 30 to 60 days of free support.
   Out of scope (unless agreed in writing): live classes inside the app, offline video downloads, instructor self-service portal, quizzes and certificates, a student web app, content creation and graphic assets beyond UI design.
2. Reality check (read before bidding)
3. Scope versus 30 days. Seven modules plus store publishing is very tight for one developer. Offer two options: full scope with the highest risk, or a phased delivery (Section 8). Phasing is the safer pitch.
4. Store billing rules. Recorded courses are digital content. Apple requires in-app purchase for them on iOS (guideline 3.1.1), and Google Play requires its own billing for digital goods. Real-time one-to-one services such as consultations were allowed to use outside payment at the time of writing (3.1.3(d)). Rules differ by country and change, so check the current guidelines before promising the gateway-only payment flow the client describes. Store commission is a cost the client must accept, and every purchase must be verified on the server.
5. Video protection. Full protection against screen recording is impossible. Promise best effort: managed video hosting with expiring signed URLs, Android secure-window flag, iOS capture detection, and a visible watermark with the student ID.
6. Payment methods. No single gateway covers every country and wallet. Typical choices are an Egyptian aggregator for wallets, a Saudi gateway for Mada, and Stripe for international cards. Confirm which countries the client sells to first.
7. Electronic invoices. Legal e-invoicing rules differ by country. The MVP issues a PDF receipt; legal compliance is a separate task once the countries are known.
8. Store accounts. The client must create and own the Apple Developer and Google Play accounts. Review takes days, so submit by day 24.
9. User roles
   Role
   Can do
   Guest
   Browse catalog, watch teasers
   Student
   Everything a guest can, plus buy, watch, book, review, view invoices
   Admin
   Manage content, schedule, orders, users, notifications, reports
10. Functional requirements
    Priority: M = must, S = should, C = could.
    4.1 Accounts
    ID
    Requirement
    Pri
    Acceptance criteria
    A1
    Sign up and log in with email and password
    M
    Account created, email verified, session persists after restart
    A2
    Sign up and log in with phone and OTP
    M
    OTP expires in 5 minutes, max 5 attempts per hour
    A3
    Google and Apple sign-in
    M
    Works on both platforms (Apple sign-in is required on iOS when other social logins exist)
    A4
    Password reset with OTP
    M
    Old password stops working after reset
    A5
    Student profile with courses, upcoming consultations, invoice history
    M
    Lists load in under 2 seconds
    A6
    In-app account deletion
    M
    Required by both stores; removes personal data
    4.2 Courses and video
    ID
    Requirement
    Pri
    Acceptance criteria
    C1
    Catalog with categories
    M
    Paginated list, category navigation
    C2
    Search and filter by category, price, rating
    M
    Results update within 1 second
    C3
    Course detail: teaser video, syllabus, price, reviews
    M
    Teaser plays without login
    C4
    Reviews and ratings by enrolled students only
    S
    One review per student per course
    V1
    Secure playback only after purchase
    M
    Direct link without a valid token returns 403
    V2
    Resume playback and mark lessons complete
    M
    Resumes within 5 seconds of last position
    V3
    Progress bar per course
    M
    Percentage matches completed lessons
    V4
    Anti-capture measures and watermark
    S
    Android blocks screenshots; watermark shows user ID
    4.3 Consultations
    ID
    Requirement
    Pri
    Acceptance criteria
    K1
    List consultation types with duration, price, specialist
    M
    Admin-editable
    K2
    Calendar to pick day and hour from available slots
    M
    Two students cannot book the same slot
    K3
    Pay, then confirm booking
    M
    Slot is held for 10 minutes during payment, then released
    K4
    Attach meeting link (Zoom or Google Meet)
    M
    Phase A: admin pastes link. Phase B: auto-generated
    K5
    Reminders to student and admin
    M
    Push at 24 hours and 1 hour before
    K6
    Reschedule and cancel policy
    S
    Cutoff time and refund rule configurable
    4.4 Payments
    ID
    Requirement
    Pri
    Acceptance criteria
    P1
    Cards (Visa, Mastercard, Mada) through a hosted gateway form
    M
    Card data never touches our server
    P2
    Local wallets such as Vodafone Cash
    S
    Depends on the chosen gateway
    P3
    Apple Pay and Google Pay
    S
    Works on real devices
    P4
    Local currency or USD by country
    S
    Price shown matches the charged amount
    P5
    Store billing for courses on iOS and Android
    M
    Receipt validated on the server before access is granted
    P6
    Server confirms every payment by webhook, idempotent
    M
    Duplicate webhook does not create a second order
    P7
    PDF invoice after each success, with invoice history
    M
    Unique invoice number, downloadable
    P8
    Admin refunds
    S
    Access revoked on refund
    4.5 Notifications and admin
    ID
    Requirement
    Pri
    Acceptance criteria
    N1
    Push on purchase and booking confirmation
    M
    Delivered within 1 minute
    N2
    Promotional pushes sent by admin to segments
    S
    Student can opt out in settings
    D1
    Admin login with roles
    M
    Passwords hashed, rate-limited login
    D2
    Manage courses, sections, lessons, video upload
    M
    Upload progress and status shown
    D3
    Manage consultation types and availability
    M
    Changes appear in the app immediately
    D4
    Orders and payments list with filters and CSV export
    M
    Filter by date, status, method
    D5
    Sales dashboard and financial reports
    S
    Totals match the payments table
    D6
    Manage users and enrollments (grant or revoke)
    M
    Action logged with admin name and time
    D7
    Coupons
    C
    Percent or fixed, with expiry
11. Non-functional requirements
    • Languages: Arabic with full right-to-left layout, plus English.
    • Performance: video starts in under 3 seconds on 4G; API responses under 500 ms for normal requests.
    • Security: HTTPS only, hashed passwords, token auth with expiry, rate limiting, server-side authorization on every endpoint, payment card data handled only by the gateway.
    • Reliability: daily database backups, error and crash reporting.
    • Privacy: privacy policy and terms linked in the app and store listings.
    • Maintainability: clean architecture, README, environment-based config, API documentation.
12. Recommended architecture
    Layer
    Choice
    Reason
    Mobile
    Flutter with Riverpod
    One codebase for both stores
    Backend
    Laravel with PostgreSQL
    Fast to build; fits the Flutter, Laravel, Postgres stack
    Admin
    Laravel Filament panel
    Admin screens in days instead of weeks
    Video
    Managed host with signed URLs (Bunny Stream, Mux, Vimeo or Cloudflare Stream)
    Protection and adaptive streaming without building it
    Push
    Firebase Cloud Messaging
    Standard for both platforms
    OTP
    SMS provider chosen per country
    Coverage and price vary
    Payments
    One aggregator per region plus store billing
    See Section 2
13. Data model (entities)
    User, Category, Course, Section, Lesson, Enrollment, LessonProgress, Review, ConsultationType, AvailabilitySlot, Booking, Order, OrderItem, Payment, Invoice, Coupon, DeviceToken, Notification.
    Key relations: a Course has many Sections, a Section has many Lessons. A User has many Enrollments and many LessonProgress rows. A ConsultationType has many AvailabilitySlots, and a Slot has at most one Booking. An Order has many OrderItems (course or booking), one or more Payments, and one Invoice.
14. Delivery plan
    Option 1: phased (recommended).
    Days
    Focus
    Milestone
    1 to 5
    Requirements sign-off, wireframes, data model, API contract, repos and CI
    Client approves scope and design
    6 to 12
    Backend: auth, roles, courses, enrollments, video tokens; admin course CRUD
    API tested in Postman
    13 to 20
    Flutter: auth, catalog, detail, player, progress; one gateway plus store billing
    Buy and watch works end to end
    21 to 26
    Consultations, reminders, push, invoices, admin orders
    Full Phase A flow works
    27 to 30
    Testing, bug fixes, store submission, docs, handover
    Phase A delivered
    31 to 60
    Phase B: extra gateways and wallets, promo pushes, reports, auto meeting links, coupons, legal e-invoice
    Final delivery
    Option 2: everything in 30 days. Same plan with all items compressed. Only offer it with a written warning that store review and gateway approvals may push the date.
    Payment milestones: 30 percent at sign-off, 40 percent at the end of Phase A, 30 percent at final handover. Agree the price after the client answers the questions in Section 9; the upper end of the budget fits the full scope.
15. Questions for the client
16. Which countries and currencies will students pay from?
17. Do you already have a payment gateway account? Which one?
18. Do you already have Apple Developer and Google Play accounts?
19. Where are the course videos hosted today? How many hours in total?
20. How many courses and students at launch, and in a year?
21. Is Arabic only enough, or Arabic and English?
22. Do you have a brand guide, logo and design files?
23. How many consultation specialists, and how is their schedule managed?
24. Zoom or Google Meet, and who owns the account?
25. What is the refund and cancellation policy?
26. Do you need legal e-invoices (which country)?
27. Which languages for SMS OTP, and which countries?
28. Who writes the privacy policy and terms?
29. Do you have an existing website or database to import?
30. Who will test and approve each milestone, and how fast can they reply?
31. Risks
    Risk
    Impact
    Mitigation
    Store rejects external payment for courses
    Launch delay
    Implement store billing for courses from the start
    Gateway approval takes weeks
    Payments blocked
    Client applies on day 1; build with sandbox keys
    Scope grows during the project
    Missed deadline
    Written change requests and priced additions
    Video piracy concerns
    Client dissatisfaction
    Set expectations: best effort, not absolute
    Slow client feedback
    Delays
    Agree reply times in the contract
    Solo developer illness or overload
    Delay
    Keep 15 percent buffer; phase the scope
32. Prompts for Gemini (requirements, estimate, proposal)
    Prompt 1: refine the requirements
    Act as a senior business analyst. Below is a freelance project listing.
    [PASTE THE FULL LISTING]
    Use the attached requirements document as the draft. Find missing
    requirements, contradictions and unrealistic items for a 30-day,
    $2,500-$5,000 budget. Return: (1) a list of gaps, most severe first,
    (2) what to cut or move to Phase B, (3) any assumption I must confirm
    with the client. This is a deliverable, so the 200-word limit does not apply.
    Prompt 2: architecture and estimate
    Act as a solution architect. Stack: Flutter, Laravel, PostgreSQL.
    Compare two admin approaches (Filament vs a separate React panel) and
    three video hosts for signed-URL playback. Give cost per month at
    100, 1,000 and 10,000 students, setup effort in days, and risks.
    End with a recommendation and one sentence of reasoning.
    Prompt 3: client questions and bid message
    Write a professional proposal message in Arabic (about 150 words) for
    this project listing. Include: my understanding of the goal, the phased
    approach with two phases, the three payment milestones, the main risk
    (store billing rules), and three questions for the client. No
    exaggerated claims about experience.
33. Prompts for Antigravity (build in learning mode)
    Project rules file (paste into the project rules)
    Source of truth: docs/REQUIREMENTS.md. Never invent requirements.
    Work on ONE ticket at a time. Maximum 2 tickets in progress.
    You may write boilerplate: project setup, config, models, DTOs,
    migrations, API client scaffolding. I write the business logic.
    For each ticket: state input, expected output and acceptance criteria,
    then STOP and wait for my code.
    If I am stuck: (1) a 1-2 sentence hint, (2) pseudo-code,
    (3) only the single line I am stuck on.
    After I paste code: bugs first, then style. Never rewrite my code.
    Errors: name the file, function and concept to check. Do not give the fix.
    If I write 'give me the answer', do it, and add one line naming the
    concept I should retry from scratch.
    Prompt A: scaffold and backlog
    Read docs/REQUIREMENTS.md. Create docs/BACKLOG.md: small tickets
    (each under 4 hours) grouped by milestone, with ID, title, requirement
    IDs covered, input, expected output and acceptance criteria. Order by
    dependency. Do not write any feature code. Then generate only the
    bare project structure for the Flutter app and the Laravel API.
    Prompt B: ticket loop
    Start ticket [ID]. Explain the goal in 3 lines, give input and
    expected output, list the files I will touch, then stop and wait for
    my implementation.
    Prompt C: review before closing a ticket
    Review my code for ticket [ID] against its acceptance criteria and
    requirement IDs. Check: security (authorization on the server), edge
    cases, error handling, and missing tests. List problems by severity,
    one line each. Do not rewrite the code.
    Prompt D: end of day
    Summarize today in 5 lines: tickets finished, tickets blocked, hints I
    used, new Error Log lines, and the first action for tomorrow.
34. Delivery checklist
    • Android build live on Google Play and iOS build live on the App Store
    • Full source code for the app, API and admin, with README and setup guide
    • API documentation and environment variable list
    • Admin user guide (short PDF or video)
    • Backups and monitoring configured
    • Handover of all accounts and keys to the client
    • Free support for 30 to 60 days, with a written definition of what counts as a bug versus a new feature
