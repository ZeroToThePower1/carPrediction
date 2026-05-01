import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import axios from 'axios'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors({
    origin: "*"
}))

function connectMongoose() {
    try {
        mongoose.connect('mongodb://localhost:27017/carprediction')
        console.log('Connected to MongoDB successfully')
    } catch (err) {
        console.error(err)
    }
}
connectMongoose()

const history = mongoose.Schema({
    year: Number,
    kilometers_Driven: Number,
    Owner_Count: Number,
    Engine_CC: Number,
    Milage: Number,
    Prediction: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const historyModel = mongoose.model('history', history)

app.post('/predict', async (req, res) => {
    try {
        const { year, kilometers_Driven, owner_Count, engine_CC, milage } = req.body
        

        if (!year || !kilometers_Driven || !owner_Count || !engine_CC || !milage) {
            return res.status(400).json({ message: "missing required field" })
        }
        

        const response = await axios.post('http://localhost:8000/predict', {
            Year: year,
            Kilometers_Driven: kilometers_Driven,
            Owner_Count: owner_Count,
            Engine_CC: engine_CC,
            Mileage: milage  
        })
        
        const prediction = response.data.predicted_price
        

        const historyEntry = new historyModel({
            year,
            kilometers_Driven,
            Owner_Count: owner_Count,
            Engine_CC: engine_CC,
            Milage: milage,
            Prediction: prediction 
        })
        
        await historyEntry.save() 
        
        res.json({
            predicted_price: prediction
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ 
            message: "Internal server error", 
            error: err.message 
        })
    }
})

app.get('/history', async (req, res) => {
    try {
        const data = await historyModel.find().sort({createdAt: -1})
        res.json(data)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "internal server error" })
    }
})

app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`)
})