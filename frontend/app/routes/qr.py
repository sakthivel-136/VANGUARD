from fastapi import APIRouter, HTTPException, status
from app.database import insert_row, select_rows, create_qr, update_qr, delete_row

router = APIRouter(
    prefix="/qr",
    tags=["QR Codes"]
)

TABLE = "qr"

# ---------------------------
# CREATE QR
# ---------------------------
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_qr_endpoint(data: dict):
    """
    Create a new QR code.
    """
    # Don't pass qr_id to DB (it auto-generates)
    if "qr_id" in data:
        del data["qr_id"]

    # ✅ Use the helper function that handles defaults
    result = create_qr(data)
    
    # Returns a Dictionary (matching frontend: return res.data)
    return result

# ---------------------------
# GET QR BY FACTORY
# ---------------------------
@router.get("/factory/{factory_code}")
def get_qr_by_factory(factory_code: str):
    results = select_rows(TABLE, {"factory_code": factory_code})
    return results or []

# ---------------------------
# GET QR BY ID
# ---------------------------
@router.get("/{qr_id}")
def get_qr_by_id(qr_id: int):
    rows = select_rows(TABLE, {"qr_id": qr_id})
    if not rows:
        raise HTTPException(status_code=404, detail="QR not found")
    return rows[0]

# ---------------------------
# UPDATE QR
# ---------------------------
@router.put("/{qr_id}")
def update_qr_endpoint(qr_id: int, data: dict):
    """
    Update a QR code
    """
    if "qr_id" in data:
        del data["qr_id"]

    try:
        # ✅ Use the helper function
        updated = update_qr(qr_id, data)
    except RuntimeError:
        raise HTTPException(status_code=404, detail="QR not found or update failed")
    
    # Returns a List [Dictionary] (matching frontend: return res.data[0])
    if isinstance(updated, dict):
        return [updated]
    
    return updated

# ---------------------------
# DELETE QR
# ---------------------------
@router.delete("/{qr_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_qr_endpoint(qr_id: int):
    success = delete_row(TABLE, {"qr_id": qr_id})
    if not success:
        raise HTTPException(status_code=404, detail="QR not found")
    return {"message": "Deleted successfully"}