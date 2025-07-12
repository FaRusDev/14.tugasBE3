// src/config/database.js
import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

const env = process.env.NODE_ENV || "development"

// Konfigurasi untuk berbagai environment (development, test, production)
const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: console.log,
    timezone: "+07:00", // WIB timezone
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
}

const dbConfig = config[env]

// Inisialisasi Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    timezone: dbConfig.timezone,
    pool: dbConfig.pool,
    define: {
      timestamps: true,
      paranoid: true, // Enable soft delete
      underscored: true, // Menggunakan snake_case untuk nama kolom
      freezeTableName: true, // Tidak mengubah nama tabel ke plural
    },
  }
)

// Konfigurasi JWT dan lainnya
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRE = process.env.JWT_EXPIRE || "30d"
const JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || 30
const JWT_VERIFY_EMAIL_SECRET = process.env.JWT_VERIFY_EMAIL_SECRET

// Konfigurasi email
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  from: process.env.EMAIL_FROM,
  fromName: process.env.EMAIL_FROM_NAME,
}

// Konfigurasi client
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"

// Fungsi untuk menguji koneksi database
const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("Connection to the database has been established successfully.")

    if (env === "development") {
      // Sinkronisasi model dengan database (hati-hati di production)
      await sequelize.sync({ alter: true })
      console.log("All models were synchronized successfully.")
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error)
    process.exit(1)
  }
}

// Ekspor konfigurasi
export {
  sequelize,
  Sequelize,
  JWT_SECRET,
  JWT_EXPIRE,
  JWT_COOKIE_EXPIRE,
  JWT_VERIFY_EMAIL_SECRET,
  EMAIL_CONFIG,
  CLIENT_URL,
  testConnection,
}

export default {
  sequelize,
  Sequelize,
  jwt: {
    secret: JWT_SECRET,
    expire: JWT_EXPIRE,
    cookieExpire: JWT_COOKIE_EXPIRE,
    verifyEmailSecret: JWT_VERIFY_EMAIL_SECRET,
  },
  email: EMAIL_CONFIG,
  clientUrl: CLIENT_URL,
  testConnection,
}
