import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Configuración para Session Pooler de Supabase
const SUPABASE_CONFIG = {
  host: process.env.DB_HOST || "db.qmnhdzasqtuqbndakxya.supabase.co",
  username: process.env.DB_USER || "postgres",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD || "Santy401@",
  port: process.env.DB_PORT || 6543, // ⚠️ PUERTO 6543 para Session Pooler
  dialect: "postgres",
  logging: true,
  dialectOptions: {
    ssl: { 
      require: true, 
      rejectUnauthorized: false 
    }
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
};

const sequelize = new Sequelize(SUPABASE_CONFIG);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("🟢 Conectado a Supabase via Session Pooler (IPv4 compatible)");
  } catch (error) {
    console.error("🔴 Error de conexión:", error.message);
    process.exit(1);
  }
})();

export default sequelize;