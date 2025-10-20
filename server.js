import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import app from "./app.js";
import sequelize from "./config/database.js";
import { initializeAdminUser } from "./services/authService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 6005;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    const { User, Company, Area, Task } = await import('./models/index.js');
    console.log("Models and associations loaded!");

    console.log("Sincronizando tablas...");
    await Company.sync({ alter: true });
    console.log("Companies table synchronized!!!");

    await User.sync({ alter: true });
    console.log("Users table synchronized!");

    await Area.sync({ alter: true });
    console.log("Areas table synchronized!");

    await Task.sync({ alter: true });
    console.log("Tasks table synchronized!");

    console.log("Database synchronized!");

    await initializeAdminUser();

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
