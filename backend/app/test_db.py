from app.database import engine

try:
    connection = engine.connect()
    print("✅ Supabase DB Connected Successfully!")
    connection.close()
except Exception as e:
    print("❌ DB Connection Failed")
    print(e)