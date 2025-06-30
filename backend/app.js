const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const cors = require('cors')
const dotenv = require('dotenv');
const connectDB = require("./utils/db")
const userRoutes = require("./routes/user-routes");
const companyRoutes = require("./routes/company-routes")
const jobRoutes = require("./routes/job-routes")
const applicationRoutes = require("./routes/application-routes")
const path = require("path")
const session = require('express-session');
const flash = require('connect-flash');

dotenv.config({})

// Middleware for sessions and flash
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Pass flash messages to the views
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});



// Set the view engine to EJS
app.set('view engine', 'ejs');

// Specify the directory for EJS templates
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const corsOption = {
    origin: 'http//localhost:5173',
    credentials: true
}
app.use(cors(corsOption));

//apis
app.use("/user",userRoutes)
app.use("/company",companyRoutes)
app.use("/job",jobRoutes)
app.use("/application",applicationRoutes)

app.get("/",(req,res)=>{
    res.render("index")
})



const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
    
})