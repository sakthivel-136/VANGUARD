# VanguardVisor Security System

VanguardVisor is a comprehensive, real-time security management platform designed specifically for managing factory patrol rounds, security guards, and scan points using QR codes. The platform empowers facility administrators to track guard performance, view live patrols, and securely generate compliance reports.

## System Architecture

The project is structured entirely as a decoupled monorepo containing a **Next.js Frontend** and a **FastAPI (Python) Backend**. It utilizes **Supabase** (PostgreSQL) as its primary database.

- **Frontend:** Next.js 15, Tailwind CSS, Framer Motion, React-PDF, Axios
- **Backend:** FastAPI, Uvicorn, Python, Supabase-py, JWT Authentication
- **Database:** Supabase (hosted PostgreSQL)

---

## 🚀 Getting Started

To run VanguardVisor locally, you will need to start both the backend server and the frontend application in separate terminal windows.

### 1. Backend Setup (FastAPI)

The backend handles all the database communication, dynamic analytics calculations, and JWT authentication. 

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create your `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and fill in your Supabase Project URL and Keys.*
3. Install the dependencies (preferably in a virtual environment):
   ```bash
   pip install -r requirements.txt
   # OR if using conda/venv:
   # pip install fastapi uvicorn supabase-py python-jose python-dotenv
   ```
4. Start the backend server on port 8000:
   ```bash
   # Windows
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Mac/Linux (or just run main.py)
   python3 main.py
   ```
   *The API will be available at `http://localhost:8000` (or `http://0.0.0.0:8000` over the network).*

---

### 2. Frontend Setup (Next.js)

The frontend is a beautifully designed, responsive admin dashboard tailored for factory management. It is protected globally via JWT middleware.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Create your `.env.local` file based on the example:
   ```bash
   cp .env.example .env.local
   ```
   *Edit `.env.local` to point the `NEXT_PUBLIC_API_URL` to your backend's IP address (e.g., `http://192.168.1.5:8000` or `http://localhost:8000`).*
3. Install the NPM dependencies:
   ```bash
   npm install --legacy-peer-deps
   # (Using legacy-peer-deps ensures React 19 compatibility with some dependencies)
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application will automatically start on `http://0.0.0.0:3030` and is accessible across your local Wi-Fi network.*

---

## 🔐 Authentication & Features

The entire front-end routing is protected securely by a Next.js `middleware.ts` integration.
- Standard users are not permitted to manually type paths like `/report-download` or `/factory` into their URL bar. Doing so intercepts the connection and forwards them cleanly back to the `/login` portal.
- On a successful login, an `access_token` JWT cookie is dispensed covering their permissions and resolving the factory admin name on downstream PDF reports.

### Key Modules:
- **Reports:** Filter patrols by Date and Factory and instantly export compliant PDF tables with complete timing records. 
- **User Management (CRUD):** Add, Edit, Delete, or View security guard PINs, IDs, and assignments directly targeting the Supabase Auth tables. 
- **QR Management:** Programmatically map real-world factory checkpoints sequentially to physical spaces for your guards to scan on rounds. 
- **Live Analytics (Dashboard):** Visually digest how many expected rounds were missed vs achieved in a dynamic doughnut widget. 

---

*Property of Vanguard Visor © 2026*
