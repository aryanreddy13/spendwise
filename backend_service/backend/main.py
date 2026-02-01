from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from financial_calculator_agent import financial_calculator
from rag import get_financial_advice_with_rag
from data_loader import DataLoader
from file_parser import FileParser
from typing import Optional
import json

app = FastAPI(title="SpendWise API")

# Enable CORS
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for uploaded user data (in production, use a database)
# NOTE: This will reset when the Vercel function spins down.
uploaded_data_store = {}

class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = "default"

class ExpenseItem(BaseModel):
    date: str
    category: str
    amount: float
    description: Optional[str] = ""
    type: str = "expense" # income or expense

class AuthRequest(BaseModel):
    email: str
    password: str # In real app, hash this


# Initialize data loader
data_loader = DataLoader()

@app.get("/")
def read_root():
    """
    Root endpoint - Health check
    """
    return {
        "message": "FinGenius AI Agent API is running",
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": {
            "upload": "/upload",
            "ask": "/ask",
            "dashboard": "/dashboard/*",
            "auth": "/auth/*",
            "expenses": "/expenses"
        }
    }

@app.post("/auth/login")
def login(auth: AuthRequest):
    # Simulating auth - in production checks DB password hash
    # For now, just return a user_id based on email
    user_id = auth.email.replace("@", "_").replace(".", "_")
    return {"token": user_id, "user_id": user_id, "name": auth.email.split("@")[0]}

@app.post("/auth/register")
def register(auth: AuthRequest):
    user_id = auth.email.replace("@", "_").replace(".", "_")
    # Seed DB
    loader = DataLoader(user_id)
    # Ensure it saves initial state
    loader.save_user_data(loader.data)
    return {"message": "User registered", "user_id": user_id}

@app.post("/expenses")
def add_expense(item: ExpenseItem, user_id: str = "default"):
    loader = DataLoader(user_id)
    data = loader.data
    
    expenses = data.get("expenses", [])
    
    # Map to backend format
    new_expense = {
        "date": item.date,
        "category": item.category,
        "amount": item.amount,
        "description": item.description,
        "type": item.type # store type if backend allows extension
    }
    
    expenses.insert(0, new_expense)
    data["expenses"] = expenses
    
    loader.save_user_data(data)
    return {"message": "Expense added", "expense": new_expense}


class GoalItem(BaseModel):
    name: str
    target: float
    saved: float
    deadline: str
    icon: Optional[str] = "Target"

@app.post("/goals")
def add_goal(item: GoalItem, user_id: str = "default"):
    loader = DataLoader(user_id)
    data = loader.data
    goals = data.get("goals", [])
    
    new_goal = item.dict()
    new_goal["id"] = len(goals) + 1
    
    goals.append(new_goal)
    data["goals"] = goals
    
    loader.save_user_data(data)
    return {"message": "Goal added", "goal": new_goal}



@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload CSV or Excel file with financial data.
    Returns a file_id to be used in subsequent API calls.
    """
    try:
        contents = await file.read()
        
        # Decode for CSV, keep as bytes for Excel
        if file.filename.endswith('.csv'):
            file_content = contents.decode('utf-8')
        else:
            file_content = contents
        
        # Parse the file
        parsed_data = FileParser.parse_file(file_content, file.filename)
        
        # Generate a simple file ID (in production, use UUID + database)
        file_id = f"uploaded_{len(uploaded_data_store)}"
        uploaded_data_store[file_id] = parsed_data
        
        # For Vercel, we use /tmp for temporary storage. 
        # Note: This is NOT persistent across requests.
        import os
        upload_dir = "/tmp/user_data" if os.environ.get("VERCEL") else "user_data"
        os.makedirs(upload_dir, exist_ok=True)
        with open(f"{upload_dir}/{file_id}.json", "w") as f:
            json.dump(parsed_data, f, indent=2)
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "message": "File uploaded and parsed successfully",
            "data_summary": {
                "expenses_count": len(parsed_data.get("expenses", [])),
                "investments_count": len(parsed_data.get("investments", [])),
                "goals_count": len(parsed_data.get("goals", []))
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/ask")
def ask_agent(req: QueryRequest):
    q = req.query.lower()
    data_loader_user = DataLoader(req.user_id)

    if any(k in q for k in ["budget", "invest", "loan", "mortgage", "debt", "interest"]):
        return financial_calculator(req.query)
    result = get_financial_advice_with_rag(req.query)
    # If the RAG function returned an error object, convert to HTTP error
    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=502, detail=result.get("error"))
    return result

# New endpoints for dashboard data
@app.get("/dashboard/summary")
def get_dashboard_summary(file_id: Optional[str] = None, user_id: str = "default"):
    """Get overall dashboard summary"""
    # Use uploaded data if file_id is provided
    if file_id and file_id in uploaded_data_store:
        data = uploaded_data_store[file_id]
    else:
        loader = DataLoader(user_id)
        data = loader.data
    
    profile = data.get("profile", {})
    monthly = data.get("monthly_history", [])
    current_month = monthly[-1] if monthly else {}
    
    # Calculate totals
    total_investment = sum(inv.get("amount", 0) for inv in data.get("investments", []))
    total_expenses = sum(exp.get("amount", 0) for exp in data.get("expenses", []))
    
    return {
        "profile": profile,
        "current_month": current_month,
        "total_investment": total_investment,
        "total_expenses": total_expenses
    }

@app.get("/dashboard/expenses")
def get_expenses(file_id: Optional[str] = None, user_id: str = "default"):
    """Get expense breakdown"""
    # Use uploaded data if file_id is provided
    if file_id and file_id in uploaded_data_store:
        data = uploaded_data_store[file_id]
    else:
        loader = DataLoader(user_id)
        data = loader.data
    
    expenses = data.get("expenses", [])
    
    # Create summary by category
    summary = {}
    for expense in expenses:
        category = expense.get("category", "Other")
        amount = expense.get("amount", 0)
        summary[category] = summary.get(category, 0) + amount
    
    return {
        "expenses": expenses,
        "summary": summary
    }

@app.get("/dashboard/investments")
def get_investments(file_id: Optional[str] = None, user_id: str = "default"):
    """Get investment recommendation requests"""
    if file_id and file_id in uploaded_data_store:
        data = uploaded_data_store[file_id]
    else:
        loader = DataLoader(user_id)
        data = loader.data
    
    return {
        "investments": data.get("investments", [])
    }

@app.get("/dashboard/goals")
def get_goals(file_id: Optional[str] = None, user_id: str = "default"):
    """Get financial goals"""
    if file_id and file_id in uploaded_data_store:
        data = uploaded_data_store[file_id]
    else:
        loader = DataLoader(user_id)
        data = loader.data
    
    return {
        "goals": data.get("goals", [])
    }

@app.get("/dashboard/budgets")
def get_budgets(file_id: Optional[str] = None, user_id: str = "default"):
    """Get budget vs actuals"""

    # 1️⃣ Try uploaded file
    if file_id and file_id in uploaded_data_store:
        data = uploaded_data_store[file_id]

    # 2️⃣ Try DataLoader
    else:
        loader = DataLoader(user_id)
        data = loader.data or {}

    # 3️⃣ If budgets exist, return
    if data.get("budgets"):
        return {"budgets": data["budgets"]}

    # 4️⃣ If expenses exist, derive budgets
    expenses = data.get("expenses", [])
    if expenses:
        category_totals = {}
        for exp in expenses:
            cat = exp.get("category", "Others")
            amt = float(exp.get("amount", 0))
            category_totals[cat] = category_totals.get(cat, 0) + amt

        return {
            "budgets": [
                {
                    "name": cat,
                    "budget": round(spent * 1.25),
                    "spent": round(spent),
                    "icon": "💰"
                }
                for cat, spent in category_totals.items()
            ]
        }

    # 5️⃣ 🚨 ABSOLUTE FALLBACK (UI MUST NEVER BE EMPTY)
    return {
        "budgets": [
            {"name": "Food", "budget": 12000, "spent": 14500, "icon": "🍔"},
            {"name": "Transport", "budget": 4000, "spent": 2800, "icon": "🚌"},
            {"name": "Shopping", "budget": 6000, "spent": 7200, "icon": "🛍️"},
        ]
    }



@app.get("/dashboard/subscriptions")
def get_subscriptions(file_id: Optional[str] = None, user_id: str = "default"):
    """Get subscriptions"""
    if file_id and file_id in uploaded_data_store:
        data = uploaded_data_store[file_id]
    else:
        loader = DataLoader(user_id)
        data = loader.data
    
    return {
        "subscriptions": data.get("subscriptions", [])
    }

@app.get("/dashboard/history")
def get_monthly_history(file_id: Optional[str] = None, user_id: str = "default"):
    """Get monthly financial history"""
    if file_id and file_id in uploaded_data_store:
        data = uploaded_data_store[file_id]
    else:
        loader = DataLoader(user_id)
        data = loader.data
    
    return {
        "history": data.get("monthly_history", [])
    }

@app.get("/dashboard/analytics")
def get_analytics(file_id: Optional[str] = None, user_id: str = "default"):
    """Get AI-generated analytics"""
    if file_id and file_id in uploaded_data_store:
        data = uploaded_data_store[file_id]
    else:
        loader = DataLoader(user_id)
        data = loader.data
    
    # Calculate expense summary
    expenses = {}
    for expense in data.get("expenses", []):
        category = expense.get("category", "Other")
        amount = expense.get("amount", 0)
        expenses[category] = expenses.get(category, 0) + amount
    
    profile = data.get("profile", {})
    total_expenses = sum(exp.get("amount", 0) for exp in data.get("expenses", []))
    total_investments = sum(inv.get("amount", 0) for inv in data.get("investments", []))
    
    # Create a query for the AI agent
    query = f"Analyze my finances: Income: {profile.get('monthly_income', 0)}, Expenses: {total_expenses}, Investments: {total_investments}"
    
    analytics = get_financial_advice_with_rag(query)
    if isinstance(analytics, dict) and analytics.get("error"):
        # Return structured error to frontend instead of 500
        raise HTTPException(status_code=502, detail=analytics.get("error"))

    return {
        "analytics": analytics,
        "summary": {
            "expenses": expenses,
            "monthly_data": data.get("monthly_history", [])
        }
    }

@app.get("/dashboard/insights")
def get_insights(file_id: Optional[str] = None, user_id: str = "default"):
    """Get AI generated insights"""
    if file_id and file_id in uploaded_data_store:
        data = uploaded_data_store[file_id]
    else:
        loader = DataLoader(user_id)
        data = loader.data
    
    # Calculate Monthly Summary Stats for the top cards
    profile = data.get("profile", {})
    monthly_income = profile.get("monthly_income", 0)
    
    current_month_history = data.get("monthly_history", [])[-1] if data.get("monthly_history") else {}
    total_expenses = current_month_history.get("expense", 0) if current_month_history else 0
    # Or sum from expense list if we want exact current month
    # Let's use the detailed list for accuracy if available, else history
    # The loader puts detailed expenses in `expenses`
    detailed_expenses_sum = sum(e["amount"] for e in data.get("expenses", []))
    
    # Savings
    savings = monthly_income - detailed_expenses_sum
    savings_rate = (savings / monthly_income * 100) if monthly_income > 0 else 0
    
    return {
        "insights": data.get("insights", []),
        "summary": {
            "income": monthly_income,
            "expenses": detailed_expenses_sum,
            "savings": savings,
            "savingsRate": round(savings_rate, 1)
        }
    }
