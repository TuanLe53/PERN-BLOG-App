const express = require("express");
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const corsOptions = require("./config/corsOption");
const credentials = require("./middleware/credential");
const morgan = require('morgan');
// const verifyJWT = require("./middleware/verifyJWT")

const PORT = process.env.PORT || 3500


app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(express.text());
app.use(express.urlencoded({ extended: true, limit: '50mb' }, ));
app.use(cookieParser());
app.use(morgan('dev'));

app.use("/images/avatar", express.static("uploads/avatar"))
app.use("/images/thumbnail", express.static("uploads/thumbnail"))
app.use("/", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/", require("./routes/blog"));

// app.use(verifyJWT);

app.listen(PORT, () => {console.log(`Server running on port: ${PORT}`)})