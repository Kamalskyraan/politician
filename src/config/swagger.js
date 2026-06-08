import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My API",
    description: "API Documentation",
  },

  servers: [
    {
      url: "https://political.skyraantech.com/server/api",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const outputFile = "./src/config/swagger-output.json";

const routes = ["./src/routes/index.js"];

const swaggerAutogenInstance = swaggerAutogen({
  openapi: "3.0.0",
});

swaggerAutogenInstance(outputFile, routes, doc);
