# # 🌌 Vespera — Considered Objects

A sophisticated, full-stack e-commerce platform featuring a lightweight **Vanilla JavaScript SPA** frontend and a robust **FastAPI + SQLite REST API** backend.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| --- | --- |
| **Backend** | FastAPI, SQLAlchemy 2.0, SQLite, Pydantic v2, PyJWT, Passlib |
| **Frontend** | Vanilla JavaScript (No frameworks/build tools), Modern HTML5, Custom CSS3 |

---

## ✨ Features

* **Product Discovery:** Dynamic product catalog, live search, and category-based filtering.
* **Shopping Cart & Wishlist:** Fully functional cart and checkout flow. Guest cart/wishlist are persisted in `localStorage` and automatically synced to the server upon login.
* **Authentication:** Secure user authentication using **JWT tokens** (Registration, Login, and Protected Routes).
* **Discounts & Social:** Real-time promo code validation and dynamic product reviews (Read & Submit).
* **Admin Dashboard:** Dedicated panel to manage products, track orders, view users, and configure promotional codes.

---

## 📂 Project Structure

```directory
.
├── backend/            # FastAPI backend application
│   ├── app/
│   │   ├── main.py             # App entrypoint, CORS setup, router registration
│   │   ├── database.py         # SQLAlchemy engine & session configuration
│   │   ├── seed.py             # Automatic database seeder (Categories, Products, Users)
│   │   ├── core/
│   │   │   ├── config.py       # Pydantic settings & .env loader
│   │   │   └── security.py     # Password hashing & JWT helpers
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic request/response validation schemas
│   │   └── api/routes/         # Route handlers (Auth, Products, Orders, Promos, etc.)
│   ├── requirements.txt
│   ├── .env                    # Local environment config
│   └── .env.example
└── frontend/           # Single-Page Application (SPA)
    └── index.html       # Single-file frontend (HTML/CSS/JS, zero build steps)

```

---

## 🚀 Getting Started

### 1. Backend Setup

Navigate to the backend directory, set up a virtual environment, and spin up the server:

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate          # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env

# Start the development server
uvicorn app.main:app --reload --port 8000

```

> 💡 **Note:** On the very first run, the database (`vespera.db`) will be created automatically and pre-seeded with demo data.

* **API Base URL:** `http://localhost:8000/api`
* **Interactive API Docs (Swagger UI):** `http://localhost:8000/docs`

### 2. Frontend Setup

Since the frontend is built with pure Vanilla JS and requires no compilation, you can serve it using any static file server:

```bash
# Navigate to frontend
cd frontend

# Start a local static server
python3 -m http.server 5500

```

Now, open your browser and go to: **`http://localhost:5500/index.html`**

> ⚠️ **Important:** If you run the frontend on a different port or host, make sure to update the `CORS_ORIGINS` variable in your `backend/.env` file and restart the backend server.

---

## 🔐 Credentials & Configuration

### Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| **Admin** | `admin@vespera.shop` | `Admin123!` |
| **Customer** | `mariam@vespera.shop` | `Demo1234!` |

### Environment Variables (`backend/.env`)

| Variable | Description | Default / Example |
| --- | --- | --- |
| `DATABASE_URL` | SQLAlchemy database connection string | `sqlite:///./vespera.db` |
| `SECRET_KEY` | JWT signing secret key | *Change in production* |
| `ALGORITHM` | Encryption algorithm for JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time length | `30` |
| `CORS_ORIGINS` | Allowed origins for frontend connections | `http://localhost:5500` |

---

## 📝 License

This project is open-source and available under the MIT License.