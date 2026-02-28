from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from app.routes import (
    auth,
    admin,
    factories,
    scan_points,
    security_users,
    qr,
    scanning_details,
    report_download
)

from app.dependencies import get_current_user

# Initialize FastAPI app
app = FastAPI(
    title="Security Verifier API",
    version="1.0.0",
    description="Backend API for Security Verifier system"
)

# -----------------------------
# CORS SETTINGS (Fixed for Network Access)
# -----------------------------
# We allow "*" during development so your phone/tablet/laptop can connect via IP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Include routers
# -----------------------------

# 🔓 Auth → /auth/login (Prefix is defined inside auth.py)
app.include_router(auth.router)

# 🔐 Admin → JWT required (Protected)
app.include_router(
    admin.router,
    dependencies=[Depends(get_current_user)]
)

# Other Routers
app.include_router(factories.router)
app.include_router(scan_points.router)
app.include_router(security_users.router)
app.include_router(qr.router)
app.include_router(scanning_details.router)
app.include_router(report_download.router)

# -----------------------------
# Root endpoint
# -----------------------------
@app.get("/", summary="API Root")
def root():
    return {
        "message": "Security Verifier API is running ✅",
        "docs": "http://10.10.6.67:8000/docs"
    }

if __name__ == "__main__":
    import uvicorn
    # This ensures it runs on your local network
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)