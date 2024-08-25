if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const session = require("express-session");
const User = require("./Model/users.js");

const userRouter = require("./routes/user.js")
const chatRoutes = require("./routes/ChatRoutes.js")
const messageRoutes = require("./routes/MessageRoute.js")

const DB_URL = process.env.ATLASDB_URL;

main()
  .then(console.log("Connected to db"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(DB_URL);
}

const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL
  credentials: true
}));

app.use(cors());
app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use("/users", userRouter);
app.use("/chat",chatRoutes);
app.use("/message",messageRoutes);

app.get("/",(req,res)=>{
  res.send("Root page")
})

app.use((err, req, res, next) => {
  console.log(err.message);
  return res.status(500).json({ message: err.message, success: false });
});

app.listen(3000, () => {
  console.log("Lisiting to post 3000");
});
