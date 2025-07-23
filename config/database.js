import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const AWS_CONFIG = {
  host: process.env.DB_HOST || "rios-db.c6jy2yqs8p98.us-east-1.rds.amazonaws.com",
  username: process.env.DB_USER || "postgre",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD || "TaskRios401",
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
  logging: console.log,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }, 
  },
};

const LOCAL_CONFIG = {
  host: process.env.LOCAL_DB_HOST || "localhost",
  username: process.env.LOCAL_DB_USER || "postgres",
  database: process.env.LOCAL_DB_NAME || "localdb",
  password: process.env.LOCAL_DB_PASSWORD || "postgres", 
  port: process.env.LOCAL_DB_PORT || 5432,
  dialect: "postgres",
  logging: console.log,
};

const useLocalDB = process.env.DB_FORCE_LOCAL === "true";
const selectedConfig = useLocalDB ? LOCAL_CONFIG : AWS_CONFIG;

const sequelize = new Sequelize(selectedConfig);

(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      useLocalDB
        ? "🟢 Conectado a PostgreSQL LOCAL (manual override)"
        : "🟢 Conectado a AWS RDS (default)"
    );

    await sequelize.sync({ force: true });
    console.log("✅ Tablas sincronizadas");
  } catch (error) {
    console.error("🔴 Error de conexión:", error.message);
    process.exit(1);
  }
})();

export default sequelize;