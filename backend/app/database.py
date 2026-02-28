import os
from typing import Dict, Any, List, Optional
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()


# --------------------------------------------------
# ENV CONFIG
# --------------------------------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")

# Try to use Service Role Key (full admin access) first, fall back to Anon key
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL missing")

if not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_KEY missing")

# --------------------------------------------------
# SUPABASE CLIENT
# --------------------------------------------------
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_db() -> Client:
    return supabase

# --------------------------------------------------
# TABLE NAMES
# --------------------------------------------------
SCANNING_TABLE = "scan_logs"
QR_TABLE = "qr"

# --------------------------------------------------
# GENERIC HELPERS
# --------------------------------------------------
def insert_row(table: str, data: Dict[str, Any]) -> Dict:
    """
    Insert one row
    """
    res = supabase.table(table).insert(data).execute()

    if not res.data:
        raise RuntimeError(f"Insert failed: {res}")

    return res.data[0]

def select_rows(
    table: str,
    filters: Optional[Dict[str, Any]] = None
) -> List[Dict]:
    """
    Select rows with optional filters
    """
    query = supabase.table(table).select("*")

    if filters:
        for key, val in filters.items():
            query = query.eq(key, val)

    res = query.execute()

    if not res.data:
        return []

    return res.data

def update_row(
    table: str,
    filters: Dict[str, Any],
    data: Dict[str, Any]
) -> Dict:
    """
    Update rows using filters. Returns the first updated row.
    """
    if not data:
        raise ValueError("No data provided for update")

    query = supabase.table(table).update(data)

    for key, val in filters.items():
        query = query.eq(key, val)

    res = query.execute()

    if not res.data:
        raise RuntimeError(f"Update failed: {res}")

    return res.data[0]

def delete_row(
    table: str,
    filters: Dict[str, Any]
) -> bool:
    """
    Delete rows using filters
    """
    query = supabase.table(table).delete()

    for key, val in filters.items():
        query = query.eq(key, val)

    res = query.execute()

    return bool(res.data)

# --------------------------------------------------
# SCAN LOG HELPERS
# --------------------------------------------------
def create_scan_log(data: Dict[str, Any]) -> Dict:
    return insert_row(SCANNING_TABLE, data)

def get_all_scan_logs() -> List[Dict]:
    return select_rows(SCANNING_TABLE)

def get_scan_logs_by_factory(factory_code: str) -> List[Dict]:
    return select_rows(
        SCANNING_TABLE,
        {"factory_code": factory_code}
    )

def get_scan_logs_by_guard(guard_name: str) -> List[Dict]:
    return select_rows(
        SCANNING_TABLE,
        {"guard_name": guard_name}
    )

def delete_scan_log(scan_id: int) -> bool:
    return delete_row(
        SCANNING_TABLE,
        {"id": scan_id}
    )

# --------------------------------------------------
# QR HELPERS
# --------------------------------------------------
def create_qr(data: Dict[str, Any]) -> Dict:
    """
    Create a QR. Ensures waiting_time has a value.
    """
    # If key is missing OR explicitly null (from empty frontend input), default to 15
    if "waiting_time" not in data or data["waiting_time"] is None:
        data["waiting_time"] = 15

    return insert_row(QR_TABLE, data)

def get_qrs(filters: Optional[Dict[str, Any]] = None) -> List[Dict]:
    return select_rows(QR_TABLE, filters)

def get_qr_by_id(qr_id: int) -> Optional[Dict]:
    rows = select_rows(
        QR_TABLE,
        {"qr_id": qr_id}
    )
    return rows[0] if rows else None

def update_qr(qr_id: int, data: Dict[str, Any]) -> Dict:
    """
    Update a QR.
    CRITICAL FIX: Only sets default waiting_time IF the key is present in the payload.
    If the key is missing (e.g. user is only updating 'name'), we do NOT overwrite
    the existing waiting_time in the database.
    """
    # Only modify if 'waiting_time' is part of the update payload
    if "waiting_time" in data:
        if data["waiting_time"] is None:
            data["waiting_time"] = 15

    return update_row(
        QR_TABLE,
        {"qr_id": qr_id},
        data
    )

def delete_qr(qr_id: int) -> bool:
    return delete_row(
        QR_TABLE,
        {"qr_id": qr_id}
    )