
from datetime import datetime
from app.utils.round_slots import generate_round_slots

# -----------------------------
# Generate Scan Report
# -----------------------------
def generate_report(db, factory_code: str, report_date: str):
    if not db:
        raise RuntimeError("Supabase client not initialized")

    # 1️⃣ Fetch factory details (THIS WAS MISSING)
    factory = (
        db.table("factories")
        .select("factory_name, factory_address")
        .eq("factory_code", factory_code)
        .single()
        .execute()
        .data
    )

    if not factory:
        raise ValueError("Factory not found")

    # 2️⃣ Generate round slots
    round_slots = generate_round_slots(report_date)

    # 3️⃣ Fetch QR codes
    qr_codes = (
        db.table("qr")
        .select("qr_id, qr_name")
        .eq("factory_code", factory_code)
        .execute()
        .data or []
    )

    # 4️⃣ Fetch scans
    scans = (
        db.table("scanning_details")
        .select("*")
        .eq("factory_code", factory_code)
        .gte("scan_time", f"{report_date}T00:00:00+05:30")
        .lte("scan_time", f"{report_date}T23:59:59+05:30")
        .execute()
        .data or []
    )

    # 5️⃣ Build report rows
    report = []

    for qr in qr_codes:
        for round_no, slot in round_slots:
            scan = next(
                (
                    s for s in scans
                    if s.get("qr_id") == qr.get("qr_id")
                    and s.get("round_slot") == slot.isoformat()
                ),
                None
            )

            report.append({
                "qr_name": qr.get("qr_name"),
                "round": round_no,
                "scan_time": scan.get("scan_time") if scan else None,
                "lat": scan.get("lat") if scan else None,
                "log": scan.get("log") if scan else None,
                "guard_name": scan.get("guard_name") if scan else None,
                "status": "SUCCESS" if scan else "FAILED",
            })

    # 6️⃣ FINAL RESPONSE (FACTORY DATA INCLUDED ONCE)
    return {
        "factory_code": factory_code,
        "factory_name": factory.get("factory_name"),
        "factory_address": factory.get("factory_address"),
        "report_date": report_date,
        "data": report
    }
