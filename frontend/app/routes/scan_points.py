from fastapi import APIRouter, HTTPException, status, Query
from app.database import supabase
from app.schemas.scan_point import ScanPointCreate, ScanPointUpdate, ScanPointResponse

router = APIRouter(
    prefix="/scan-points",
    tags=["Scan Points"]
)

# ---------------------------
# CREATE scan point
# ---------------------------
@router.post("", status_code=status.HTTP_201_CREATED, response_model=ScanPointResponse)
def create_scan_point(payload: ScanPointCreate):
    # Check if factory exists
    factory = supabase.table("factories").select("factory_code").eq("factory_code", payload.factory_id).execute()
    if not factory.data:
        raise HTTPException(status_code=404, detail="Factory not found")

    # Check duplicate name
    existing = supabase.table("scan_points").select("*").eq("scan_point_name", payload.scan_point_name).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Scan Point with this name already exists")

    insert_data = {
        "factory_id": payload.factory_id,
        "scan_point_name": payload.scan_point_name,
        "scan_point_code": payload.scan_point_code or payload.scan_point_name,
        "location": payload.location,
        "scan_type": payload.scan_type,
        "floor": payload.floor,
        "area": payload.area,
        "risk_level": payload.risk_level,
        "is_active": True
    }

    result = supabase.table("scan_points").insert(insert_data).select("*").execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create scan point")

    return result.data[0]

# ---------------------------
# GET all scan points (optionally filter by factory)
# ---------------------------
@router.get("", response_model=list[ScanPointResponse])
def get_scan_points(factory_id: str = Query(None, description="Filter by Factory ID")):
    query = supabase.table("scan_points").select("*")
    if factory_id:
        query = query.eq("factory_id", factory_id)
    result = query.execute()
    return result.data or []

# ---------------------------
# GET scan point by ID
# ---------------------------
@router.get("/{scan_point_id}", response_model=ScanPointResponse)
def get_scan_point(scan_point_id: str):
    result = supabase.table("scan_points").select("*").eq("id", scan_point_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Scan Point not found")
    return result.data[0]

# ---------------------------
# UPDATE scan point
# ---------------------------
@router.put("/{scan_point_id}", response_model=ScanPointResponse)
def update_scan_point(scan_point_id: str, payload: ScanPointUpdate):
    existing = supabase.table("scan_points").select("*").eq("id", scan_point_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Scan Point not found")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    # ✅ Fixed: use returning='representation'
    result = supabase.table("scan_points").update(update_data, returning="representation").eq("id", scan_point_id).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to update scan point")

    return result.data[0]

# ---------------------------
# DELETE scan point
# ---------------------------
@router.delete("/{scan_point_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scan_point(scan_point_id: str):
    existing = supabase.table("scan_points").select("*").eq("id", scan_point_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Scan Point not found")

    supabase.table("scan_points").delete().eq("id", scan_point_id).execute()
    return None
