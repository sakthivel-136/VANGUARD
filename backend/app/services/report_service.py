# app/services/report_service.py

from datetime import datetime, timezone, timedelta
from app.utils.round_slots import generate_round_slots
from app.services.report_audit_service import save_report_audit

# IST timezone
IST = timezone(timedelta(hours=5, minutes=30))


def build_report_filename(
    report_type: str,
    factory_code: str,
    report_date: str,
    user_name: str | None,
    generated_at: datetime,
):
    """
    Build audit-friendly PDF filename
    """
    safe_name = (user_name or "UNKNOWN").replace(" ", "_")
    ts = generated_at.strftime("%Y%m%d_%H%M%S")
    return f"{report_type}_{factory_code}_{report_date}_{safe_name}_{ts}.pdf"


def generate_report(
    db,
    factory_code: str,
    report_date: str,
    current_user: dict
):
    if not db:
        raise RuntimeError("Supabase client not initialized")

    # -----------------------------
    # 1️⃣ Fetch factory
    # -----------------------------
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

    # -----------------------------
    # 2️⃣ Generate round slots
    # -----------------------------
    round_slots = generate_round_slots(report_date)

    # -----------------------------
    # 3️⃣ Fetch QR codes
    # -----------------------------
    qr_codes = (
        db.table("qr")
        .select("qr_id, qr_name")
        .eq("factory_code", factory_code)
        .execute()
        .data or []
    )

    # -----------------------------
    # 4️⃣ Fetch scans
    # -----------------------------
    scans = (
        db.table("scanning_details")
        .select("*")
        .eq("factory_code", factory_code)
        .gte("scan_time", f"{report_date}T00:00:00+05:30")
        .lte("scan_time", f"{report_date}T23:59:59+05:30")
        .execute()
        .data or []
    )

    # -----------------------------
    # 5️⃣ Build report rows
    # -----------------------------
    rows = []

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

            rows.append({
                "qr_name": qr.get("qr_name"),
                "round": round_no,
                "scan_time": scan.get("scan_time") if scan else None,
                "latitude": scan.get("lat") if scan else None,
                "longitude": scan.get("log") if scan else None,
                "guard_name": scan.get("guard_name") if scan else None,
                "username": scan.get("user_id") if scan else None,
                "status": "SUCCESS" if scan else "FAILED",
            })

    # -----------------------------
    # 6️⃣ Audit info
    # -----------------------------
    generated_at = datetime.now(IST)

    audit_id = save_report_audit(
        db=db,
        report_type="PATROL_REPORT",
        factory_code=factory_code,
        report_date=report_date,
        current_user=current_user,
        generated_at=generated_at,
    )

    # -----------------------------
    # 7️⃣ Auto PDF filename
    # -----------------------------
    audit_filename = build_report_filename(
        report_type="PATROL_REPORT",
        factory_code=factory_code,
        report_date=report_date,
        user_name=current_user.get("name"),
        generated_at=generated_at,
    )

    # -----------------------------
    # 8️⃣ Final response
    # -----------------------------
    return {
        "factory_code": factory_code,
        "factory_name": factory.get("factory_name"),
        "factory_address": factory.get("factory_address"),
        "report_date": report_date,

        "generated_by": {
            "user_id": current_user["user_id"],
            "name": current_user.get("name"),
            "role": current_user["role"],
        },
        "generated_at": generated_at.isoformat(),

        "audit": {
            "audit_id": audit_id,
            "filename": audit_filename,
        },

        "data": rows,
    }
