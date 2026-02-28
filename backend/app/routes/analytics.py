from fastapi import APIRouter, Query
from datetime import datetime, timedelta
from app.database import supabase
from typing import Optional, List, Dict, Any

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_overview(factory_code: Optional[str] = None):
    # Fetch active guards
    guards_query = supabase.table("security_users").select("*").eq("role", "security")
    if factory_code:
        guards_query = guards_query.eq("factory_code", factory_code)
    guards_res = guards_query.execute()
    active_guards = len(guards_res.data) if guards_res.data else 0

    # Fetch total scan points
    points_query = supabase.table("scan_points").select("id", count="exact")
    if factory_code:
        points_query = points_query.eq("factory_id", factory_code)
    points_res = points_query.execute()
    total_points = points_res.count if points_res.count else 0

    # Let's assume an expected round is 1 scan per point per guard (or just active_guards * total_points)
    # If the user has a specific defined "round" count, this is the best dynamic estimate
    expected_scans_today = active_guards * total_points

    # Actual scans today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0).isoformat()
    scans_query = supabase.table("scan_logs").select("id", count="exact").gte("created_at", today_start)
    if factory_code:
        scans_query = scans_query.eq("factory_code", factory_code)
    scans_res = scans_query.execute()
    actual_scans = scans_res.count if scans_res.count else 0

    missed_scans = max(0, expected_scans_today - actual_scans)

    return {
        "total_expected_rounds": expected_scans_today,
        "active_guards": active_guards,
        "inactive_guards": 0,
        "missed_scans": missed_scans
    }

@router.get("/dashboard-charts")
def get_dashboard_charts(factory_code: Optional[str] = None):
    # Fetch scans for today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0).isoformat()
    scans_query = supabase.table("scan_logs").select("*").gte("created_at", today_start)
    if factory_code:
        scans_query = scans_query.eq("factory_code", factory_code)
    
    scans_res = scans_query.execute()
    scans = scans_res.data or []

    # Activity data (grouped by hour)
    activity_map = {}
    guard_map = {}
    
    for scan in scans:
        if "created_at" in scan and scan["created_at"]:
            try:
                hour = datetime.fromisoformat(scan["created_at"].replace("Z", "+00:00")).strftime("%H:00")
            except:
                hour = "12:00"
            activity_map[hour] = activity_map.get(hour, 0) + 1
        
        guard_name = scan.get("guard_name", "Unknown")
        guard_map[guard_name] = guard_map.get(guard_name, 0) + 1

    activity_data = [{"time": k, "scans": v} for k, v in sorted(activity_map.items())]
    # Removed mock empty array fallback so frontend properly shows "No scan activity data" when empty

    guard_data = [{"name": k, "scans": v} for k, v in sorted(guard_map.items(), key=lambda item: item[1], reverse=True)]

    return {
        "activity_data": activity_data,
        "guard_data": guard_data
    }

@router.get("/scans-by-guard")
def get_scans_by_guard(factory_code: Optional[str] = None):
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0).isoformat()
    query = supabase.table("scan_logs").select("guard_name").gte("created_at", today_start)
    if factory_code:
        query = query.eq("factory_code", factory_code)
    
    res = query.execute()
    scans = res.data or []

    counts = {}
    for scan in scans:
        gn = scan.get("guard_name", "Unknown")
        counts[gn] = counts.get(gn, 0) + 1

    result = [{"guard_name": gn, "scan_count": c} for gn, c in counts.items()]
    return sorted(result, key=lambda x: x["scan_count"], reverse=True)

@router.get("/guard-performance")
def get_guard_performance(target_date: str, factory_code: Optional[str] = None):
    # Fetch scans for the target date
    query = supabase.table("scan_logs").select("guard_name, point_id").gte("created_at", f"{target_date}T00:00:00").lt("created_at", f"{target_date}T23:59:59")
    if factory_code:
        query = query.eq("factory_code", factory_code)
    
    res = query.execute()
    scans = res.data or []

    # Get actual total scan points for this factory to measure against
    points_query = supabase.table("scan_points").select("id", count="exact")
    if factory_code:
        points_query = points_query.eq("factory_id", factory_code)
    points_res = points_query.execute()
    actual_total_points = points_res.count if points_res.count else 1 # default to 1 to avoid div by zero

    metrics = {}
    for scan in scans:
        gn = scan.get("guard_name", "Unknown")
        if gn not in metrics:
            metrics[gn] = {
                "guard_name": gn, 
                "total_points": actual_total_points, 
                "scanned_points": 0, 
                "missed_points": 0,
                "unique_points": set()
            }
        
        # Count unique points scanned by this guard
        point_id = scan.get("point_id")
        if point_id:
            metrics[gn]["unique_points"].add(point_id)
            metrics[gn]["scanned_points"] = len(metrics[gn]["unique_points"])
    
    for gn in metrics:
        metrics[gn]["missed_points"] = max(0, metrics[gn]["total_points"] - metrics[gn]["scanned_points"])
        # Remove the set so it's JSON serializable
        del metrics[gn]["unique_points"]

    return {
        "target_date": target_date,
        "metrics": list(metrics.values())
    }
