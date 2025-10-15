import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Para producción en Render, usa connection string
const getConnectionString = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  if (process.env.DB_FORCE_LOCAL === "true") {
    return `postgresql://${process.env.LOCAL_DB_USER || "postgres"}:${process.env.LOCAL_DB_PASSWORD || "postgres"}@${process.env.LOCAL_DB_HOST || "localhost"}:${process.env.LOCAL_DB_PORT || 5432}/${process.env.LOCAL_DB_NAME || "localdb"}`;
  }
  
  return `postgresql://${process.env.DB_USER || "postgres"}:${process.env.DB_PASSWORD || "Santy401@"}@${process.env.DB_HOST || "db.qmnhdzasqtuqbndakxya.supabase.co"}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "postgres"}`;
};

const sequelize = new Sequelize(getConnectionString(), {
  dialect: "postgres",
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  retry: {
    max: 3
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("🟢 Conectado a la base de datos correctamente");
  } catch (error) {
    console.error("🔴 Error de conexión:", error.message);
    console.error("🔴 Detalles completos:", error);
    process.exit(1);
  }
})();

export default sequelize;