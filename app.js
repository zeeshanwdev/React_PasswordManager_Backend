import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'                                                                  //For Connection Backend & Front-End
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 3000;


// app.use(cors())
app.use(cors({
  origin: 'https://your-vercel-domain.vercel.app',                                       
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));


app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// Database
main().catch(err => console.log("Database connection error:", err));
async function main() {
  await mongoose.connect(process.env.MONGODB_ATLAS);
  console.log("Connected to MongoDB");
}


const passwordsSchema = mongoose.Schema({
  site: String,
  username: String,
  password: String
})

const Password = mongoose.model('Password', passwordsSchema)



// Routes
app.get('/', async(req, res) => {
    let result = await Password.find({})
    res.json(result)
})



// app.post('/', async (req, res) => {

//   let password = req.body;
//   try {
//     await Password.insertMany(password);
//     console.log("New Data Inserted Into DB");
//     res.status(201).send("Data inserted successfully");
//   } catch (err) {
//     console.error("Error inserting data:", err);
//     res.status(500).send("Error inserting data");
//   }

// })

app.post('/', async (req, res) => {
  try {
    await Password.insertMany([req.body]);
    console.log("New data inserted");
    res.status(201).send("Data inserted successfully");
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).send("Insert failed");
  }
});


// app.delete('/', async (req, res) => {

//   try {
//     await Password.deleteOne(req.body);
//     console.log("Successfully Deleted");
//     res.status(201).send("Deleted successfully");
//   } catch (err) {
//     console.error("Error Deleting data:", err);
//     res.status(500).send("Error Deleting data");
//   }

// })

app.delete('/', async (req, res) => {
  try {
    const result = await Password.deleteOne({ id: req.body.id });
    if (result.deletedCount > 0) {
      res.status(200).send("Deleted successfully");
    } else {
      res.status(404).send("Item not found");
    }
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Delete failed");
  }
});


app.listen(port, () => console.log(`App Running on port http://localhost:${port}`))





// npm i cors
