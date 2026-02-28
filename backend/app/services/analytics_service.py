from fastapi import APIRouter, HTTPException
from datetime import date, datetime, time, timedelta
from app.database import supabase 

# Define Shift Times (These define Day vs Night windows)
DAY_START = time(6, 0)
DAY_END = time(21, 0)
NIGHT_END = time(5, 30) # 05:30 AM

GRACE_SECONDS = 600  # 10 mins (Default) -> Default Grace Period

def get_expected_scan_rounds(target_date: date):
    """
    Generates a list of times a guard IS SUPPOSED to scan
    based on rules:
    - Night Shift (Previous Day 21:00 -> Today 05:30): Every 30 Mins
    - Day Shift (Today 06:00 -> Today 21:00): Every 1 Hour
    """
    expected_times = []
    
    # 1. Generate Night Shift (Previous Day 21:00 -> Today 05:30)
    # Start at 9 PM on the day before the target date
    night_start_dt = datetime.combine(target_date - timedelta(days=1), time(21, 0))
    # End at 5:30 AM on the target date
    night_end_dt = datetime.combine(target_date, NIGHT_END)
    
    current_dt = night_start_dt
    while current_dt <= night_end_dt:
        expected_times.append(current_dt)
        current_dt += timedelta(minutes=30) # Night scans every 30 mins

    # 2. Generate Day Shift (Today 06:00 -> 21:00)
    day_start_dt = datetime.combine(target_date, DAY_START)
    day_end_dt = datetime.combine(target_date, DAY_END)
    
    current_dt = day_start_dt
    while current_dt <= day_end_dt:
        expected_times.append(current_dt)
        current_dt += timedelta(hours=1) # Day scans every 1 hour

    return expected_times

# -------------------------------------------------------
# 2️⃣ MASTER UPDATE LOGIC (PROCESSED)
# -------------------------------------------------------
def update_all_scan_statuses(target_date: date):
    """
    Runs the master update logic:
    - Calculates expected rounds.
    - Compares against `scanning_details`.
    - Updates status to 'SUCCESS', 'LATE', or 'MISSED'.
    """
    
    # 1. Fetch Scans
    # FIXED: Corrected syntax error in .select string (removed stray quote, fixed parentheses)
    response = supabase.table('scanning_details') \
        .select('id, scan_time, guard_name, guard_id, factory_code') \
        .gte('scan_time', datetime.combine(target_date, datetime.min.time())) \
        .lte('scan_time', datetime.combine(target_date, datetime.max.time())) \
        .execute()
            
    data = response.data if response.data else []

    if not data:
        return {
            "total_expected_rounds": 0,
            "total_scans_processed": 0,
            "updated_count": 0,
            "status": "completed"
        }
        
    # 2. Fetch Expected Rounds (Logic)
    expected_times = get_expected_scan_rounds(target_date)
    
    if not expected_times:
        return {
            "total_expected_rounds": 0,
            "total_scans_processed": 0,
            "updated_count": 0,
            "status": "no_data"
        }
    
    updated_count = 0

    # 3. Compare and Update
    # We need to match scans to the closest expected time.
    for item in data:
        scan_time_raw = item.get('scan_time')
        
        # Handle missing or invalid scan times
        if not scan_time_raw:
            continue
        
        # Convert string to datetime if necessary
        if isinstance(scan_time_raw, str):
            try:
                # Remove 'Z' for UTC handling or handle timezone offset
                scan_dt = datetime.fromisoformat(scan_time_raw.replace('Z', '+00:00'))
            except ValueError:
                print(f"❌ Invalid date format for ID {item['id']}")
                continue
        else:
            scan_dt = scan_time_raw

        # Find the closest expected round
        best_match = None
        min_diff = float('inf')
        
        for exp_time in expected_times:
            diff = abs((scan_dt - exp_time).total_seconds())
            if diff < min_diff:
                min_diff = diff
                best_match = exp_time

        # Determine Status
        new_status = 'MISSED' # Default if logic fails
        
        if best_match:
            if min_diff <= GRACE_SECONDS:
                new_status = 'SUCCESS'
            else:
                # If the scan exists but is outside the grace period, it's LATE
                new_status = 'LATE'
        
        # Update Database
        try:
            supabase.table('scanning_details') \
                .update({'status': new_status}) \
                .eq('id', item['id']) \
                .execute()
            updated_count += 1
        except Exception as e:
            print(f"⛔️ ERROR: Failed to update ID: {item['id']} - {e}")
            
    return {
        "total_expected_rounds": len(expected_times),
        "total_scans_processed": len(data),
        "updated_count": updated_count,
        "status": "completed"
    }