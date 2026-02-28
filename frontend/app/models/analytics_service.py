from datetime import datetime, time, timedelta, timezone
from typing import List, Dict, Tuple

# Define Shift Times
DAY_START = time(6, 0)   # 06:00 AM
DAY_END = time(21, 0)     # 09:00 PM
NIGHT_END = time(5, 30)    # 05:30 AM (Next day)

GRACE_MINUTES = 10

def get_expected_scan_rounds(current_date: datetime.date) -> List[Dict]:
    """
    Generates the list of times a guard IS SUPPOSED to scan
    based on the rules:
    - 6AM to 9PM: Every 1 Hour
    - 9PM to 5:30AM: Every 30 Mins
    """
    expected_times = []

    # 1. Generate Night Shift Rounds (from previous day's 9PM to Today's 5:30AM)
    # We process the range from 21:00 to 29:30 (Next day 05:30)
    start_hour = 21
    end_hour = 29 # 24 + 5.5
    
    t = start_hour
    while t <= end_hour:
        # Convert "25.5" to datetime object properly
        dt_start = datetime.combine(current_date, time(0,0)) + timedelta(hours=t)
        expected_times.append(dt_start)
        t += 0.5 # Increment by 30 mins

    # 2. Generate Day Shift Rounds (06:00 to 21:00)
    t = 6
    while t <= 21:
        dt_start = datetime.combine(current_date, time(0,0)) + timedelta(hours=t)
        expected_times.append(dt_start)
        t += 1 # Increment by 1 hour

    return sorted(expected_times)

def is_scan_on_time(scan_time: datetime, expected_time: datetime) -> bool:
    """
    Checks if a specific scan happened within the grace period
    of an expected time.
    """
    # Window: Expected Time +/- 10 Mins
    window_start = expected_time - timedelta(minutes=GRACE_MINUTES)
    window_end = expected_time + timedelta(minutes=GRACE_MINUTES)
    
    return window_start <= scan_time <= window_end

def analyze_guard_compliance(guard_name: str, scans: List[Dict], date_filter: datetime.date) -> Dict:
    """
    Analyzes a specific guard for a specific date.
    Returns total, missed, on-time, and efficiency %.
    """
    # 1. Get all expected times for this date
    expected_rounds = get_expected_scan_rounds(date_filter)
    
    # 2. Filter scans for this guard and date
    guard_scans = [
        s for s in scans 
        if s.get('guard_name') == guard_name 
        and s.get('scan_time').date() == date_filter
    ]

    # 3. Match expected rounds to actual scans
    stats = {
        "guard_name": guard_name,
        "total_expected": len(expected_rounds),
        "missed_count": 0,
        "on_time_count": 0,
        "efficiency": 0.0,
        "missed_details": []
    }

    for exp_time in expected_rounds:
        # Find if there is a scan within the window
        found_scan = False
        for scan in guard_scans:
            if is_scan_on_time(scan['scan_time'], exp_time):
                found_scan = True
                break # Marked this round as done
        
        if found_scan:
            stats["on_time_count"] += 1
        else:
            stats["missed_count"] += 1
            stats["missed_details"].append({
                "expected_time": exp_time.strftime("%H:%M"),
                "status": "MISSED"
            })

    # 4. Calculate Efficiency
    if stats["total_expected"] > 0:
        stats["efficiency"] = round((stats["on_time_count"] / stats["total_expected"]) * 100, 2)

    return stats