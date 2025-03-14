const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "DeKUT Online Hostel Booking API",
    version: "1.0.0",
    description: "API documentation for the hostel booking system",
  },
  servers: [{ url: "http://localhost:5000" }],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Automatically document routes
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};

module.exports = setupSwagger;
