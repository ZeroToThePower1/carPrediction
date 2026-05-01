from fastapi import FastAPI
import joblib
model = joblib.load('carprediction_model.pkl')
app = FastAPI()
@app.post("/predict")
def predict(data:dict):
    features = [[
        data["Year"],
        data["Kilometers_Driven"],
        data["Owner_Count"],
        data["Engine_CC"],
        data["Mileage"]
    ]]

    price = float(model.predict(features)[0])
    return {
        "predicted_price" : price
    }