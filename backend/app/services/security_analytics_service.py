from datetime import datetime
from reportlab.platypus import SimpleDocTemplate, Table, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4

from app.database import supabase


# ---------------- ROUND SPLIT LOGIC ---------------- #

def split_into_rounds(scans, gap_minutes=30):
    rounds = []
    current_round = []

    for scan in scans:
        scan_time = datetime.fromisoformat(scan["scan_time"])

        if not current_round:
            current_round.append(scan)
        else:
            last_time = datetime.fromisoformat(current_round[-1]["scan_time"])
            diff = (scan_time - last_time).total_seconds() / 60

            if diff > gap_minutes:
                rounds.append(current_round)
                current_round = [scan]
            else:
                current_round.append(scan)

    if current_round:
        rounds.append(current_round)

    return rounds


# ---------------- REQUIRED BY ROUTES ---------------- #
# (even if you don’t use it fully yet)

def update_all_scan_statuses():
    return {"status": "ok"}


# ---------------- REPORT DOWNLOAD SERVICE ---------------- #

def generate_report_download(payload):
    if not supabase:
        raise RuntimeError("Supabase not initialized")

    # 🔹 Factory
    factory_res = supabase.table("factories") \
        .select("factory_name, factory_address") \
        .eq("factory_code", payload.factory_code) \
        .single() \
        .execute()

    if not factory_res.data:
        raise ValueError("Factory not found")

    factory = factory_res.data

    # 🔹 Admin
    admin_res = supabase.table("users") \
        .select("full_name") \
        .eq("user_id", payload.downloaded_by) \
        .single() \
        .execute()

    admin_name = admin_res.data["full_name"] if admin_res.data else "Admin"

    # 🔹 Scan logs
    scans_res = supabase.table("scanning_details") \
        .select("""
            employee_name,
            employee_id,
            qr_name,
            latitude,
            longitude,
            scan_time
        """) \
        .eq("factory_code", payload.factory_code) \
        .gte("scan_time", f"{payload.report_date}T00:00:00") \
        .lte("scan_time", f"{payload.report_date}T23:59:59") \
        .order("scan_time") \
        .execute()

    scans = scans_res.data or []

    if not scans:
        raise ValueError("No scan data found")

    rounds = split_into_rounds(scans)

    # 🔹 PDF Setup
    file_name = f"Security_Report_{payload.report_date}.pdf"
    file_path = f"/tmp/{file_name}"

    doc = SimpleDocTemplate(file_path, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    # 🔹 Header
    elements.append(Paragraph(f"<b>{factory['factory_name']}</b>", styles["Title"]))
    elements.append(Paragraph(factory["factory_address"], styles["Normal"]))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph(
        f"<b>Security Patrol Report : {payload.report_date}</b>",
        styles["Normal"]
    ))
    elements.append(Spacer(1, 20))

    # 🔹 Rounds
    for idx, round_scans in enumerate(rounds, start=1):
        start_time = datetime.fromisoformat(round_scans[0]["scan_time"]).strftime("%I:%M %p")
        end_time = datetime.fromisoformat(round_scans[-1]["scan_time"]).strftime("%I:%M %p")

        elements.append(Paragraph(
            f"S.No : {idx} | Date : {payload.report_date} "
            f"| Start Time : {start_time} | End Time : {end_time}",
            styles["Heading4"]
        ))
        elements.append(Spacer(1, 8))

        table_data = [[
            "Employee Name",
            "Employee ID",
            "Patrol Time",
            "Location",
            "Latitude",
            "Longitude"
        ]]

        for s in round_scans:
            table_data.append([
                s["employee_name"],
                s["employee_id"],
                datetime.fromisoformat(s["scan_time"]).strftime("%I:%M %p"),
                s["qr_name"],
                s["latitude"],
                s["longitude"]
            ])

        elements.append(Table(table_data, repeatRows=1))
        elements.append(Spacer(1, 20))

    # 🔹 Footer
    elements.append(Spacer(1, 30))
    elements.append(Paragraph(
        f"Downloaded By : <b>{admin_name}</b>",
        styles["Normal"]
    ))
    elements.append(Paragraph(
        f"Downloaded On : {datetime.now().strftime('%d-%b-%Y %I:%M %p')}",
        styles["Normal"]
    ))

    doc.build(elements)

    return file_path, file_name
