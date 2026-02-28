from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.report import router as report_router

app = FastAPI(title="Security Verifier API")

# --- ADD THIS SECTION FOR SAFE HOSTING ---
origins = [
    "http://localhost:3000",        # Local Next.js
    "https://your-frontend-tunnel-url.trycloudflare.com", # Your Cloudflare Frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------------------------------------

app.include_router(report_router)

@app.get("/")
def root():
    return {"status": "API running"}