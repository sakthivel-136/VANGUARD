from fastapi import APIRouter, Depends
from app.dependencies import admin_only
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["Admin"])

# Dummy/mock data generator for dashboard
def generate_dashboard_data():
    return {
        "totalGuards": 25,
        "roundsToday": {"completed": 18, "scheduled": 20},
        "missedRounds": 2,
        "activeAlerts": 3,
        "roundStatusData": [
            {"site": "Site A", "completed": 5, "missed": 1},
            {"site": "Site B", "completed": 7, "missed": 0},
        ],
        "averageRoundTime": 42,
        "targetRoundTime": 45,
        "attendanceData": [
            {"date": "2026-01-16", "present": 20, "absent": 5},
            {"date": "2026-01-17", "present": 22, "absent": 3},
        ],
        "completionData": [
            {"date": "2026-01-16", "completedRounds": 18, "scheduledRounds": 20},
            {"date": "2026-01-17", "completedRounds": 19, "scheduledRounds": 20},
        ],
    }

@router.get("/dashboard")
def get_dashboard(current_user: dict = Depends(admin_only)):
    """
    Admin dashboard data endpoint.
    Only accessible by admins.
    """
    data = generate_dashboard_data()
    return data

