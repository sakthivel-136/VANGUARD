from fastapi import APIRouter, Depends
from app.dependencies import admin_only

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard")
def get_dashboard(user: dict = Depends(admin_only)):
    return {
        "message": f"Welcome {user['user_id']}! You are an {user['role']}"
    }

