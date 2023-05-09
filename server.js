//Server set app
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const usersRoutes = require("./Routes/users.routes");
const providersRoutes = require("./Routes/serviceProviders.routes");
const requestsRoutes = require("./Routes/requests.routes");
const reviewsRoutes = require("./Routes/reviews.routes");
const statsRoutes = require("./Routes/stats.routes");
const cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload");
const { addTimeOfRequest } = require("./Middlewares/helpers.middleware");
const path = require("path");
const fs = require("fs");
const stripe = require("./Routes/stripe.routes");
const multer = require('multer');
var bodyParser = require('body-parser')

// bodyParser.json([options])
const upload = multer({ dest: 'uploads/' });

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "https://wecare-pam6.onrender.com",
    credentials: true,
  })
);
// app.use(fileUpload());
const PORT = process.env.PORT || 3000;
const DBURL = process.env.DATABASE_URL.replace("<password>", process.env.DATABASE_PASSWORD);
mongoose
  .connect(DBURL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connected successfully"));

// Middleware to parse data-body from request
app.use(express.json());
// Middleware to parse cookie from request
app.use(cookieParser());
// Middleware to parse data-body from request
app.use(bodyParser.json());
app.use(addTimeOfRequest);
//Routes
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/providers", providersRoutes);
app.use("/api/v1/requests", requestsRoutes);
app.use("/api/v1/reviews", reviewsRoutes);
app.use("/api/v1/stats", statsRoutes);

// upload file route
app.use('/uploads', express.static('uploads'));

// Upload Endpoint
// app.post("/upload", (req, res) => {
//   if (req.files === null) {
//     return res.status(400).json({ msg: "No file uploaded" });
//   }


//   console.log("req.files: ", req.files);
  
//   let pathsArray = [];
//   const email = req.body.email;
//   let oneStepBack = path.join(__dirname, "../");
//   console.log("oneStepBack: ", oneStepBack);
//   fs.mkdirSync(`${oneStepBack}/clientside/public/uploads/${email.split("@")[0]}`, {
//     recursive: true,
//   });
//   Object.values(req.files).forEach((file) => {
//     pathsArray.push(`/uploads/${email.split("@")[0]}/${file.name}`);
//     file.mv(
//       `${oneStepBack}/clientside/public/uploads/${email.split("@")[0]}/${file.name}`,
//       (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send(err);
//         }
//       }
//     );
//   });

//   res.json({ filePath: pathsArray });
// });

app.post('/uploads', upload.any(), (req, res) => {
  console.log("req.files: ", req.files);
  const uploadedFiles = req.files.map(file => path.join('uploads', file.fieldname));
  res.json({ filePath: uploadedFiles });
});


app.use("/api/v1/stripe", stripe);

app.listen(PORT, () => console.log("http://localhost:" + PORT));

module.exports = app;
