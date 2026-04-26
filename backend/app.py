from fastapi import FastAPI, HTTPException #error response
from fastapi.middleware.cors import CORSMiddleware #connection layer
from pydantic import BaseModel #it validates and check the input that it matches condn or not
import mysql.connector


app = FastAPI()

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- DATABASE CONNECTION ----------
def get_connection():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="tanishq123",
            database="investment_engine"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------- INPUT MODEL ----------
class UserInput(BaseModel):
    risk_level: str
    investment_amount: int
    investment_type: str
    duration_years: int
    liquidity_need: str
    existing_investment:str


# ---------- SIGNUP MODEL ----------
class SignupModel(BaseModel):
    name: str
    email: str
    password: str
    age: int


# ---------- SIGNUP ENDPOINT ----------
@app.post("/signup")
def signup(user: SignupModel):

    conn = get_connection() #open sql
    cursor = conn.cursor()  # run query

    try:
        cursor.execute(
            """
            INSERT INTO users (name, email, password, age)
            VALUES (%s,%s,%s,%s) 
            """,
            (user.name, user.email, user.password, user.age)
        )

        conn.commit()

        return {"status": "success"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        conn.close()

# ---------- LOGIN MODEL ----------
class LoginModel(BaseModel):
    email: str
    password: str


# ---------- LOGIN ENDPOINT ----------
@app.post("/login")
def login(user: LoginModel):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, password FROM users WHERE email=%s",
            (user.email,)
        )

        db_user = cursor.fetchone()

        if not db_user:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if db_user["password"] != user.password:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        # minimal token for now
        token = f"user-{db_user['id']}-token"

        return {"accessToken": token}

    finally:
        cursor.close()
        conn.close()

# ---------- MAIN ENDPOINT ----------
@app.post("/generate-portfolio")
def generate_portfolio(user: UserInput):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # 1️⃣ insert user
        cursor.execute(
            """
            INSERT INTO user_profile
            (risk_level, investment_amount, investment_type, duration_years, liquidity_need, existing_investment)
            VALUES (%s,%s,%s,%s,%s,%s)
            """,
            (
                user.risk_level,
                user.investment_amount,
                user.investment_type,
                user.duration_years,
                user.liquidity_need,
                user.existing_investment
            ),
        )

        conn.commit()
        user_id = cursor.lastrowid

        # 2️⃣ get generated portfolio
        cursor.execute(
            """
            SELECT asset_name, asset_type, ROUND(allocation_pct,2) AS allocation_pct
            FROM final_portfolio
            WHERE user_id=%s
            ORDER BY allocation_pct DESC
            """,
            (user_id,),
        )

        portfolio = cursor.fetchall()

        return {
            "user_id": user_id,
            "portfolio": portfolio
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        conn.close()