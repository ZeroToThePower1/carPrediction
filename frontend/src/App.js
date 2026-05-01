import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [year, setYear] = useState("")
  const [driven, setDriven] = useState("")
  const [owners, setOwners] = useState("")
  const [enginecc, setEngineCC] = useState("")
  const [milage, setMilage] = useState("")
  const [prediction, setPrediction] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const Base_api = 'http://localhost:3000'

  async function fetchPrediction() {
    if (!year || !driven || !owners || !enginecc || !milage) {
      alert("Please fill all fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${Base_api}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          year: parseInt(year),
          kilometers_Driven: parseFloat(driven),
          owner_Count: parseInt(owners),
          engine_CC: parseFloat(enginecc),
          milage: parseFloat(milage)
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setPrediction(data.predicted_price)
      await fetchHistory()
      
      setYear("")
      setDriven("")
      setOwners("")
      setEngineCC("")
      setMilage("")
      
    } catch (err) {
      console.error(err)
      alert("Error making prediction: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchHistory() {
    try {
      const response = await fetch(`${Base_api}/history`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setHistory(data)
    } catch (err) {
      console.error(err)
      alert("Error fetching history: " + err.message)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <div className="container">
      <h1 className="title">Car Price Predictor</h1>
      
      <div className="form">
        <input 
          value={year} 
          type="number" 
          placeholder="Year (e.g., 2015)" 
          onChange={(e) => setYear(e.target.value)}
          className="input"
        />
        
        <input 
          value={driven} 
          type="number" 
          placeholder="Kilometers Driven" 
          onChange={(e) => setDriven(e.target.value)}
          className="input"
        />
        
        <input 
          value={owners} 
          type="number" 
          placeholder="Owner Count (0,1,2,3)" 
          onChange={(e) => setOwners(e.target.value)}
          className="input"
        />
        
        <input 
          value={enginecc} 
          type="number" 
          placeholder="Engine CC (e.g., 1500)" 
          onChange={(e) => setEngineCC(e.target.value)}
          className="input"
        />
        
        <input 
          value={milage} 
          type="number" 
          placeholder="Mileage (km/l)" 
          onChange={(e) => setMilage(e.target.value)}
          className="input"
        />
        
        <button 
          onClick={fetchPrediction} 
          disabled={loading}
          className="predict-button"
        >
          {loading ? "Predicting..." : "Predict Price"}
        </button>
      </div>

      {prediction !== null && (
        <div className="prediction-card">
          <h2>Predicted Price: ₹{prediction.toLocaleString()}</h2>
        </div>
      )}

      <div className="history-section">
        <h2 className="history-title">Prediction History</h2>
        <div className="history-list">
          {history.length === 0 ? (
            <p className="no-data">No predictions yet. Make your first prediction!</p>
          ) : (
            <div className="table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>KM Driven</th>
                    <th>Owners</th>
                    <th>Engine CC</th>
                    <th>Mileage</th>
                    <th>Predicted Price</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item._id}>
                      <td>{item.year}</td>
                      <td>{item.kilometers_Driven?.toLocaleString()}</td>
                      <td>{item.Owner_Count}</td>
                      <td>{item.Engine_CC}</td>
                      <td>{item.Milage}</td>
                      <td className="price-cell">₹{item.Prediction?.toLocaleString()}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;