from fastapi import FastAPI
import joblib
from fastapi.middleware.cors import CORSMiddleware  
model = joblib.load('carprediction_model.pkl')
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
def predict(data: dict):
    features = [[
        data["Year"],
        data["Kilometers_Driven"],
        data["Owner_Count"],
        data["Engine_CC"],
        data["Mileage"]
    ]]
    price = float(model.predict(features)[0])
    return {"predicted_price": price}

@app.get("/health")
def health():
    return {"status": "ok"}
