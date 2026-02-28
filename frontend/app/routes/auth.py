# app/routes/auth.py

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from datetime import timedelta

from app.core.security import create_access_token
from app.database import get_db


router = APIRouter(prefix="/auth", tags=["Authentication"])


# ----------------------
# Request Schema
# ----------------------
class LoginRequest(BaseModel):
    user_id: str
    user_pin: str


# ----------------------
# Login Route (DB BASED)
# ----------------------
@router.post("/login")
async def login(
    payload: LoginRequest,
    db=Depends(get_db)
):

    try:

        # ==============================
        # 1. Fetch user from DB
        # ==============================
        res = (
            db.table("login_info")   # 👈 CHANGE if your table name is different
            .select("user_id, user_pin, name, role")
            .eq("user_id", payload.user_id)
            .limit(1)
            .execute()
        )

        users = res.data or []

        if not users:
            raise HTTPException(
                status_code=401,
                detail="Invalid User ID or Password"
            )

        user = users[0]


        # ==============================
        # 2. Verify PIN
        # ==============================
        if user["user_pin"] != payload.user_pin:
            raise HTTPException(
                status_code=401,
                detail="Invalid User ID or Password"
            )


        # ==============================
        # 3. Create Token
        # ==============================
        access_token = create_access_token(
            {
                "user_id": user["user_id"],
                "role": user["role"],
            },
            expires_delta=timedelta(minutes=60)
        )


        # ==============================
        # 4. Return Response
        # ==============================
        return JSONResponse(
            content={
                "access_token": access_token,
                "token_type": "bearer",
                "role": user["role"],
                "name": user["name"],   # ✅ REAL NAME
            }
        )


    except HTTPException:
        raise


    except Exception as e:

        print("❌ LOGIN ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Login failed"
        )
