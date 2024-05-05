require("dotenv").config();

const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");

const cors = require("cors");
// const stripe = require('stripe')('sk_test_51P6CVYSD6JrlAzPKA8k6BZ5c5NEWkETBt8vQysvDgWQUfvwfrwJNjFGiU64JGTqiJvYS7DHCh6fkLBoMzhsB9OQP00mC7EfhMB');

connectDb();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;


app.use(express.json());

// Define a route handler for the root URL
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/contacts', require("./routes/contactRoutes") );
app.use('/api/products', require("./routes/productRoutes") );
app.use('/api/users', require("./routes/userRoutes") );
app.use(errorHandler);

app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
});


