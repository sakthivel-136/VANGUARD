# app/main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

# -----------------------------
# Import routers
# -----------------------------
from app.routes import (
    auth,
    admin,
    factories,
    report,
    scan_points,
    security_users,
    qr,
    scanning_details,
    analytics
)

# Dependency for JWT authentication
from app.dependencies import get_current_user


# -----------------------------
# Initialize FastAPI app
# -----------------------------
app = FastAPI(
    title="VanguardVisor API",
    version="1.0.0",
    description="Backend API for VanguardVisor security system"
)


# -----------------------------
# CORS (FIXED - DEV MODE)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Allow all origins (DEV only)
    allow_credentials=False,   # Must be False when using "*"
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Include routers
# -----------------------------

# 🔓 Auth → Open access
app.include_router(auth.router)

# 🔐 Admin → JWT required (Protected)
app.include_router(
    admin.router,
    dependencies=[Depends(get_current_user)]
)

# 🏭 Factories
app.include_router(factories.router)

# 📍 Scan Points
app.include_router(scan_points.router)

# 👮 Security Users
app.include_router(security_users.router)

# 🔳 QR Codes
app.include_router(qr.router)

# 📲 Scanning (Mobile)
app.include_router(scanning_details.router)

# 📄 Report Download (Patrol Report)
app.include_router(report.router)

# 📊 Analytics
app.include_router(analytics.router)

# -----------------------------
# Root endpoint
# -----------------------------
@app.get("/", summary="API Root")
def root():
    return {
        "message": "Security Verifier API is running ✅"
    }
