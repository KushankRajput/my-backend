// ============================
// Load ENV First
// ============================
require("dotenv").config();

// ============================
// Import Dependencies
// ============================
const express = require("express");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/database");
const postRoutes = require("./routes/postRoutes");
const fileUpload = require("./routes/Fileupload");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// ============================
// Create App
// ============================
const app = express();

// ============================
// Middlewares
// ============================
app.use(cookieParser());
app.use(express.json());

// ============================
// Swagger Configuration
// ============================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API Documentation",
      version: "1.0.0",
      description: "API documentation for my Express project",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Swagger UI endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================
// Routes
// ============================
app.set("view engine", "ejs");

app.use("/api/v1", postRoutes);
app.use("/api/v1", fileUpload);
app.use(express.urlencoded({ extended: false })); //for x-www-form-urlencoded in postman
const fileUpload = require("express-fileupload");
// app.use(fileUpload());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

// app.get("/", (req, res) => {
//   res.send("<h1>Server Running</h1>");
// });
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Server</title>

        <style>
            *{
                margin:0;
                padding:0;
                box-sizing:border-box;
                font-family:Arial, Helvetica, sans-serif;
            }

            body{
                display:flex;
                justify-content:center;
                align-items:center;
                height:100vh;
                background:linear-gradient(135deg,#0f172a,#1e293b);
                color:white;
            }

            .card{
                text-align:center;
                background:#ffffff15;
                backdrop-filter:blur(10px);
                padding:40px;
                border-radius:15px;
                box-shadow:0 10px 25px rgba(0,0,0,.3);
            }

            h1{
                color:#22c55e;
                margin-bottom:15px;
            }

            p{
                color:#ddd;
                margin-bottom:20px;
            }

            a{
                display:inline-block;
                text-decoration:none;
                background:#22c55e;
                color:white;
                padding:10px 20px;
                border-radius:8px;
                font-weight:bold;
            }

            a:hover{
                background:#16a34a;
            }
        </style>
    </head>

    <body>
        <div class="card">
            <h1>🚀 API Server is Running</h1>
            <p>Welcome to the Backend API.</p>
        </div>
    </body>
    </html>
  `);
});

// ============================
// DB Connection
// ============================
dbConnect();
// Cloudinary connection
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// ============================
// Start Server
// ============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 App started at http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs → http://localhost:${PORT}/api-docs`);
});

app.get("/form", (req, res) => {
  res.render("form", { message: null });
});

app.post("/submit", (req, res) => {
  const name = req.body.myName;
  const message = `Hello ${name} , Your image uploaded successfully`;
  res.render("form", {
    message: message,
  });
});
