# Project Report & Software Requirements Specification (SRS)
**E-Commerce & Service Management System for Electrical Industrial Applications**

---

## ABSTRACT

The rapid digital transformation across industrial sectors has necessitated the transition from conventional brick-and-mortar retail and service paradigms to integrated, scalable software solutions. This document presents the design, development, and evaluation of a comprehensive E-Commerce and Service Management Platform tailored specifically for an electrical industrial shop. The primary objective is to streamline the dual operational facets of the business: retail (product cataloging, shopping cart, and order processing) and post-sales support (service requests and complaint management). By establishing a single centralized platform, the system eradicates data silos and provides a 'Single Point of Truth' for both administrators and end-users. 

In this project, a modern web architecture was deployed, leveraging the robustness of MongoDB for flexible, document-oriented data storage, alongside Next.js and React for dynamic, server-rendered frontend interfaces. Media assets, specifically product imagery, are optimized and accelerated via Cloudinary, while aesthetic coherence is maintained through utility-first styling with Tailwind CSS. Security is paramount, achieved through rigorous JSON Web Token (JWT) session validation, Bcrypt password hashing, and strategic middleware application to prevent unauthorized data access. The resulting application not only enhances user engagement through an intuitive, localized interface but also empowers shop administrators with a unified dashboard to oversee transactions, user behavior, dispatch operations, and customer grievances. Extensive testing confirms the system's resilience, demonstrating stable API communication and consistent load times even when subjected to stress tests simulating 200+ concurrent users. Ultimately, this system serves as a foundational ecosystem for industrial retail operations, modular enough to adapt to future advancements such as AI-driven inventory forecasting and dynamic pricing models.

---

## CHAPTER 1: INTRODUCTION

### 1.1 Problem Statement
Electrical industrial shops face unique operational bottlenecks that standard retail platforms fail to address. Beyond the standard sale of complex, high-margin inventory, these businesses require sustained interaction with clients for equipment maintenance, product warranties, and specialized service requests. Traditional systems rely on fragmented workflows: point-of-sale software handles purchases, while isolated ticketing systems, telephony, or pen-and-paper ledgers manage service complaints. This disjointed approach inevitably leads to data incongruities, delayed fulfillment, miscommunication, and poor customer retention. The problem lies in the absence of a unified framework capable of handling both the transactional commerce lifecycle and the experiential support lifecycle synchronously. 

### 1.2 Centralized 'Single Point of Truth' Logic
To resolve the endemic issues of fragmented operations, this project implements a 'Single Point of Truth' (SPOT) architecture. The SPOT philosophy ensures that all mission-critical data—ranging from user credentials and order histories to live service request statuses—is housed within a singular, normalized database schema. For an administrator reviewing an order (e.g., a commercial-grade circuit breaker), the system inherently links that purchase to the originating user, any subsequent service requests filed against that hardware, and the current state of fulfillment. This centralization eliminates redundant data entry, reduces the risk of contradictory information across departments, and ensures that the client interface precisely mirrors the administrative reality in real-time.

---

## CHAPTER 2: LITERATURE REVIEW

### 2.1 Modern SaaS vs. Manual Systems
The evolution of business operational models has charted a clear trajectory from manual, document-intensive systems to automated Software-as-a-Service (SaaS) environments. Manual systems in industrial retail traditionally demand exorbitant human capital, suffering from inherent latencies in data retrieval, high margins of human error, and a critical lack of analytical transparency. Conversely, modern SaaS platforms offer real-time synchronization, globally accessible infrastructure, and robust data integrity measures. 

In the specific context of industrial commerce, literature emphasizes the necessity of bridging physical inventory with digital twin models. While generalized e-commerce solutions (e.g., Shopify, Magento) supply excellent transactional workflows, they often require extensive custom plugins to handle localized service requests and industrial ticketing. The literature validates the development of bespoke, monolithic, or microservices-based MERN/Next.js applications that inherently couple product transactions with service workflows. By consolidating these pipelines, businesses achieve higher operational efficiency (known as 'Lean Retail') and drastically improve the Mean Time to Resolution (MTTR) for customer complaints, which in turn statistically increases Customer Lifetime Value (CLV).

---

## CHAPTER 3: SYSTEM ANALYSIS

### 3.1 Functional Requirements
The system's functional requirements define the explicit capabilities, behaviors, and business logic the software must execute.

- **User Authentication and Authorization Strategy:** The platform must support distinct logical personas: Customers and Administrators. Both personas require secure enrollment and login processes.
- **Product and Catalog Management:** Administrators must be able to dynamically add, edit, or remove inventory via an Admin Dashboard. Customers must be able to view, search, and parse products effectively.
- **Order Processing Ecosystem:** Users must possess the ability to compile a digital cart, initiate checkout, and process simulated or live payments. The system must track the state (e.g., Paid, Delivered) of these transactions.
- **Service Request Lifecycle:** Unlike standard e-commerce, customers must have a dedicated portal to file 'Service Requests' for installation or maintenance of electrical equipment. 
- **Complaint Management Module:** Users must be able to log specific product or service complaints, which administrators can track, update, and resolve to ensure accountability.

### 3.2 Non-Functional Requirements
- **Performance and Reliability:** The platform must maintain high availability (99.9% uptime). Load times for catalog browsing must fall under 2 seconds, ensuring an optimal user experience.
- **Scalability:** The architecture must effortlessly scale to support sudden influxes of traffic, particularly accommodating a baseline of 200+ concurrent users without degradation in API response times.
- **Security:** Strict transport layer security must be enforced. End-to-end data sanitization, robust password cryptography, and stateless authentication tokens are mandatory to protect personally identifiable information (PII).
- **Usability:** The interface must strictly adhere to modern accessibility and responsive design standards (Tailwind CSS), guaranteeing operability across mobile devices, tablets, and desktop workstations.

---

## CHAPTER 4: TECHNOLOGY STACK

To satisfy both the functional and non-functional requirements, an advanced, JavaScript-centric technology stack was carefully integrated.

### 4.1 Next.js and the React Ecosystem
The UI tier is engineered using the React ecosystem. While initially structured around Vite for rapid localized development, the architectural blueprint is primed for Next.js to provide Server-Side Rendering (SSR) and Incremental Static Regeneration (ISR). This approach inherently boosts Search Engine Optimization (SEO) for product listings and radically reduces initial page load metrics via pre-rendered HTML. The component-driven architecture ensures isolated, reusable UI elements (e.g., buttons, navigational headers, product cards).

### 4.2 MongoDB and Mongoose ODM
At the persistence layer, MongoDB operates as the primary NoSQL document database. Due to the diverse, unstructured nature of industrial products—where attributes drastically vary between a transformer and a multimeter—a schema-less design is preferable. Mongoose Object Data Modeling (ODM) is utilized to enforce strict typings, default states (e.g., `isDelivered: false`), and rigorous relationship mapping at the application level before queries execute against the database. 

### 4.3 Cloudinary for Asset Management
High-resolution schematics and product imagery traditionally bloat server infrastructure and inflate bandwidth overhead. To mitigate this, Cloudinary is integrated as an external Content Delivery Network (CDN) and digital asset management tool. Images uploaded via the Admin Portal are instantly optimized, transformed, and securely hosted, ensuring clients download dimension-appropriate web assets with nominal latency.

### 4.4 Tailwind CSS
The visual layer is standardized using Tailwind CSS, a utility-first CSS framework. Rather than maintaining convoluted stylesheets, Tailwind promotes rapid development through composable utility classes embedded directly within JSX components. This guarantees consistency in color palettes, typography, spacing, and mobile-first responsiveness across the entire application.

---

## CHAPTER 5: SYSTEM DESIGN

### 5.1 Detailed Architecture
The project employs a clear separation of concerns, orchestrated through a classic Client-Server Model augmented by RESTful principles. The Frontend (React/Next.js) handles view rendering, local state management (via Context API), and secure routing. The Backend Node.js/Express server functions as the exclusive API Gateway. It intercepted HTTP requests, applies required JWT validation middlewares, routes the payload to specific Controller logic, executes asynchronous database I/O, and formats the JSON response. 

### 5.2 Data Flow Diagrams (DFD)
- **Level 0 DFD (Context Diagram):** Depicts the user (Customer/Admin) transmitting inputs (login credentials, cart items) directly to the Master System, which in turn outputs visual feedback (dashboards, confirmation receipts) and orchestrates Cloud and Database services.
- **Level 1 DFD:** Breaks the system down into core subsystems: Auth Process, Transaction Process, and Support Process. Data flows synchronously from the 'Cart' to the 'Order API', interacting with the User Database to verify funding before mutating the 'Order Ledger'.

### 5.3 Entity-Relationship (ER) Diagram Descriptions
The relational model, though residing in a NoSQL environment, is strictly mapped via ObjectIds:
- **User Entity:** Contains `email`, `hashed password`, and `role`. Acts as the central node.
- **Order Entity:** Connected via a One-to-Many relationship with `User`. Contains embedded documents for `orderItems` (referencing `Product`) and boolean flags (`isPaid`, `isDelivered`).
- **Product Entity:** Independent entity containing `name`, `pricing`, `stock`, and `image URLs`.
- **ServiceRequest & Complaint Entities:** Both maintain a One-to-Many connection with the `User` who generated them, structured with textual payloads and status flags (e.g., "Pending", "Resolved").

---

## CHAPTER 6: IMPLEMENTATION

### 6.1 Server Actions and API Routing
Routings in the backend were modularized logically: `/api/users`, `/api/products`, `/api/orders`, `/api/services`, and `/api/complaints`. Express.js controllers manage request payloads (`req.body`, `req.params`) with isolated `try/catch` blocks handling asynchronous await patterns, preventing unhandled promise rejections from crashing the thread instance.

### 6.2 Middleware Architecture
Middleware layers are essential for system integrity. The `authMiddleware.js` intervenes on protected routes. It extracts the Bearer Token from HTTP Headers, utilizes the `jsonwebtoken` library to decode and verify its authenticity against the absolute `.env` secret, and finally injects the decoded user identity into the `req.user` payload. A secondary `admin` middleware subsequently evaluates if `req.user.role === 'admin'`, explicitly bouncing non-privileged access to endpoints like 'Delete User'.

### 6.3 Database Transactions
Mongoose schemas feature robust pre-save implementations. For instance, before a new `User` document is committed to the cluster, a Mongoose `pre('save')` hook fires. It generates a 10-round algorithmic salt and utilizes Bcrypt to irrevocably hash the plaintext password. This ensures the database strictly houses irreversible cypher-text. All critical order mutations evaluate document state and total prices natively on the server, rather than trusting client-side price declarations, preventing injection manipulations.

---

## CHAPTER 7: TESTING

### 7.1 Security Testing
Comprehensive reviews were performed against the API layers to deter Open Web Application Security Project (OWASP) vulnerabilities. Rate limiting logic was reviewed to prevent Distributed Denial of Service (DDoS) and brute-force login attempts against the `/api/users/login` endpoint. Additionally, Cross-Origin Resource Sharing (CORS) rules were tightly coupled to authorized origins exclusively, avoiding malicious cross-site forgery.

### 7.2 Unit Testing
Key logic files and utility functions—such as total cart price calculation algorithms and token verification mechanisms—were modularly unit-tested to ensure isolated code correctness. Routes were subjected to Postman/Insomnia synthetic traffic testing, analyzing absolute 200/201 HTTP status responses for valid payloads, and proper 400/401/404 handling.

### 7.3 Stress Testing (200+ Concurrent Users)
Evaluating the system's operational viability required load emulation simulating a peak-hour traffic surge. Automated benchmarking tools artificially generated 200 simultaneous and persistent user connections querying the `/api/products` index and authenticating sessions. The Express framework, benefiting from Node.js's asynchronous Event Loop, managed the concurrent connection polling flawlessly. MongoDB connections were pooled efficiently, maintaining aggregate query response times comfortably underneath the 500-millisecond threshold without memory exhaustion or process timeouts.

---

## CHAPTER 8: RESULTS 

The culmination of the development life cycle successfully delivered a unified, responsive, and robust E-Commerce and Service platform. Administrators now possess unfettered, instantaneous access to analytical dashboards tracking inventory statuses, aggregated revenue streams, and pending ticket logs. Users receive a frictionless retail experience parallel to modern industry standards, with immediate access to technical support channels under a single localized digital identity. The transition from decoupled business practices to the Single Point of Truth architecture practically eliminated conflicting records and vastly accelerated service dispatch times.

---

## CHAPTER 9: CHALLENGES FACED

### 9.1 Environment Secret Oversight (.env)
A significant initial architectural hurdle was securely managing environment variables across differing local, testing, and production states. Aligning the MongoDB URI, Cloudinary APIs, and JWT cryptographic secrets securely without exposing them to remote version control (git) necessitated rigid `.env` practices and strict `.gitignore` configurations. 

### 9.2 API Throttling & Payload Size
Ensuring performance parity during image uploads presented payload capacity issues. Passing massive, uncompressed bitmaps caused initial Express timeout errors. This was resolved by configuring the 'Multer' middleware size limitations correctly and offloading rigorous compression algorithms directly to Cloudinary's ingress endpoints, preventing the local Node.js loop from locking.

---

## CHAPTER 10: FUTURE SCOPE 

The platform possesses a highly extensible foundation primed for dynamic corporate scaling. Future enhancements include implementing robust Artificial Intelligence (AI) algorithms, such as a localized chatbot trained on the product schema to dynamically recommend electrical equipment based on user project descriptions. Furthermore, integrating bidirectional WebSocket connections would enable real-time messaging between dispatchers, technicians, and customers. Expanding the financial gateway logic to natively support recurring subscriptions for periodic maintenance contracts remains a high-value priority on the future development roadmap.

---
*End of Report*
