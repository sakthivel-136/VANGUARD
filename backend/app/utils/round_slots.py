# app/utils/round_slots.py

from datetime import datetime, timedelta
import pytz

IST = pytz.timezone("Asia/Kolkata")

# Base round start times
ROUND_TIMES = [
    "00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30",
    "04:00","04:30","05:00","05:30","06:00","07:00","08:00","09:00",
    "10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00",
    "18:00","19:00","20:00","21:00","21:30","22:00","22:30","23:00","23:30"
]


def generate_round_slots(report_date: str):
    """
    Returns:
    [
      (round_no, start_dt, end_dt),
      ...
    ]
    """

    base = datetime.strptime(report_date, "%Y-%m-%d")
    base = IST.localize(base)

    slots = []

    for i, t in enumerate(ROUND_TIMES):

        h, m = map(int, t.split(":"))

        start = base.replace(hour=h, minute=m, second=0)

        if i < len(ROUND_TIMES) - 1:
            nh, nm = map(int, ROUND_TIMES[i+1].split(":"))
            end = base.replace(hour=nh, minute=nm, second=0)
        else:
            end = start + timedelta(minutes=30)

        slots.append((i + 1, start, end))

    return slots
