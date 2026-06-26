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
app.use("/api/v1", postRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Server Running</h1>");
});

// ============================
// DB Connection
// ============================
dbConnect();

// ============================
// Start Server
// ============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 App started at http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs → http://localhost:${PORT}/api-docs`);
});
