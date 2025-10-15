import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// ✅ CONFIGURACIÓN CORRECTA para Session Pooler
const SUPABASE_CONFIG = {
  host: 'aws-1-us-east-1.pooler.supabase.com', // ⚠️ NUEVO HOST
  port: 5432, // ⚠️ PUERTO 5432 (no 6543)
  username: 'postgres.qmnhdzasqtuqbndakxya', // ⚠️ NUEVO USUARIO
  password: process.env.DB_PASSWORD || 'Santy401@',
  database: 'postgres',
  dialect: 'postgres',
  logging: false, // Eliminar warning
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
};

const sequelize = new Sequelize(SUPABASE_CONFIG);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 CONEXIÓN EXITOSA a Supabase Session Pooler');
    console.log('📍 Host: aws-1-us-east-1.pooler.supabase.com');
    console.log('📍 Usuario: postgres.qmnhdzasqtuqbndakxya');
  } catch (error) {
    console.error('🔴 ERROR:', error.message);
    process.exit(1);
  }
})();

export default sequelize;