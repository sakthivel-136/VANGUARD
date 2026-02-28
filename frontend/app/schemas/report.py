from datetime import datetime
import pytz

from app.utils.round_slots import generate_round_slots

IST = pytz.timezone("Asia/Kolkata")


# -----------------------------
# Generate Scan Report (FAST)
# -----------------------------
def generate_report(db, factory_code: str, report_date: str):

    if not db:
        raise RuntimeError("Supabase client not initialized")


    # ==============================
    # 1️⃣ Fetch factory details
    # ==============================
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


    # ==============================
    # 2️⃣ Generate round slots
    # ==============================
    round_slots = generate_round_slots(report_date)


    # ==============================
    # 3️⃣ Fetch QR codes
    # ==============================
    qr_codes = (
        db.table("qr")
        .select("qr_id, qr_name")
        .eq("factory_code", factory_code)
        .execute()
        .data or []
    )


    # ==============================
    # 4️⃣ Fetch scans
    # ==============================
    scans = (
        db.table("scanning_details")
        .select("*")
        .eq("factory_code", factory_code)
        .gte("scan_time", f"{report_date}T00:00:00+05:30")
        .lte("scan_time", f"{report_date}T23:59:59+05:30")
        .execute()
        .data or []
    )


    # ==============================
    # 5️⃣ Index scans (KEY STEP 🚀)
    # ==============================
    scan_map = {}

    for s in scans:

        rs = s.get("round_slot")

        if not rs:
            continue

        # Normalize datetime
        dt = datetime.fromisoformat(rs.replace("Z", "+00:00"))

        if dt.tzinfo is None:
            dt = IST.localize(dt)
        else:
            dt = dt.astimezone(IST)

        key = (str(s.get("qr_id")), dt)

        scan_map[key] = s


    # ==============================
    # 6️⃣ Build report (FAST)
    # ==============================
    report = []


    for qr in qr_codes:

        qr_id = str(qr.get("qr_id"))

        for round_no, start_dt, end_dt in round_slots:

            key = (qr_id, start_dt)

            scan = scan_map.get(key)


            # --------------------------
            # Status
            # --------------------------
            if scan:
                status = "SUCCESS"
            else:
                status = "FAILED"


            report.append({

                "qr_name": qr.get("qr_name"),

                "round": round_no,

                "scan_time": scan.get("scan_time") if scan else None,

                "lat": scan.get("lat") if scan else None,

                "log": scan.get("log") if scan else None,

                "guard_name": scan.get("guard_name") if scan else None,

                "status": status,
            })


    # ==============================
    # 7️⃣ Final response
    # ==============================
    return {

        "factory_code": factory_code,

        "factory_name": factory.get("factory_name"),

        "factory_address": factory.get("factory_address"),

        "report_date": report_date,

        "data": report,
    }
