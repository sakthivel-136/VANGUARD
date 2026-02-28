# app/routes/report.py

from fastapi import APIRouter, Depends, Query
from datetime import datetime
import pytz

from app.database import get_db
from app.utils.round_slots import generate_round_slots


router = APIRouter(prefix="/report", tags=["Report"])

IST = pytz.timezone("Asia/Kolkata")


@router.get("/download")
def download_report(
    factory_code: str = Query(...),
    report_date: str = Query(...),
    db=Depends(get_db),
):

    try:

        # ==============================
        # 1. Generate rounds
        # ==============================
        round_slots = generate_round_slots(report_date)


        # ==============================
        # 2. Fetch QR codes
        # ==============================
        qr_codes = (
            db.table("qr")
            .select("qr_id, qr_name")
            .eq("factory_code", factory_code)
            .execute()
            .data or []
        )


        # ==============================
        # 3. Fetch scan logs
        # ==============================
        scans = (
            db.table("scanning_details")
            .select("id, qr_id, guard_name, scan_time, lat, log, status, round_slot")
            .eq("factory_code", factory_code)
            .gte("scan_time", f"{report_date}T00:00:00+05:30")
            .lte("scan_time", f"{report_date}T23:59:59+05:30")
            .execute()
            .data or []
        )


        # ==============================
        # 4. Parse round_slot
        # ==============================
        for s in scans:

            rs = s.get("round_slot")

            if not rs:
                s["round_dt"] = None
                continue

            dt = datetime.fromisoformat(rs.replace("Z", "+00:00"))

            if dt.tzinfo is None:
                dt = IST.localize(dt)
            else:
                dt = dt.astimezone(IST)

            s["round_dt"] = dt


        # ==============================
        # 5. Build report
        # ==============================
        report = []


        for qr in qr_codes:

            qr_id = str(qr["qr_id"])   # normalize


            for round_no, start_dt, end_dt in round_slots:

                scan = next(
                    (
                        s for s in scans
                        if str(s.get("qr_id")) == qr_id
                        and s.get("round_dt") == start_dt
                    ),
                    None
                )


                # Normalize status
                if scan:

                    raw = (scan.get("status") or "").lower()

                    if raw in ["success", "completed", "done"]:
                        status = "SUCCESS"
                    else:
                        status = "MISSED"

                else:
                    status = "MISSED"


                report.append({

                    "qr_name": qr["qr_name"],

                    "round": round_no,

                    "scan_time": scan.get("scan_time") if scan else None,

                    "lat": scan.get("lat") if scan else None,

                    "lon": scan.get("log") if scan else None,

                    "guard_name": scan.get("guard_name") if scan else None,

                    "status": status,
                })


        return report


    except Exception as e:

        print("❌ REPORT ERROR:", e)

        return {
            "success": False,
            "message": str(e)
        }
