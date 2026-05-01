import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import joblib
selected_features = ['Year', 'Kilometers_Driven', 'Owner_Count', 'Engine_CC', 'Mileage']
df = pd.read_excel("car_price_dataset.xlsx")
x = df[selected_features]
y =  df['Price']

x_train, x_test,y_train,y_test = train_test_split(
    x,y,test_size=0.2,random_state=42
)

model = LinearRegression()
model.fit(x_train,y_train)
predictions = model.predict(x_test)
score = r2_score(y_test,predictions)

print(score)
joblib.dump(model, 'carprediction_model.pkl')
print("exported")
