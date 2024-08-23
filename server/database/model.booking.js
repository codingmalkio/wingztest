const { Sequelize, Model, DataTypes } = require('sequelize');
require('dotenv').config()
const pg = require("pg")
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: './database.sqlite'
// });


const sequelize = process.env.DB_LINK ? (new Sequelize(process.env.DB_LINK, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectModule: pg,
  dialect: "postgres",
  dialectOptions: {}, //removed ssl
})) : (new Sequelize({
  dialect: 'postgres',
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  clientMinMessages: 'notice',
  dialectModule: pg,
}));

// Define Booking model
class Booking extends Model { }
Booking.init({
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  userId: { type: DataTypes.STRING, allowNull: false },
  driverId: { type: DataTypes.STRING, allowNull: true },
  pickupLocation: { type: DataTypes.JSON, allowNull: true },
  destination: { type: DataTypes.JSON, allowNull: true },
  previewRoute: { type: DataTypes.JSON, allowNull: true },
  status: {
    type: DataTypes.ENUM(['pending', 'accepted', 'declined', 'started', 'picked-up', 'dropped-off']),
    defaultValue: 'pending',
  },
  pickupTime: { type: DataTypes.DATE, allowNull: true },
  timestamp: { type: DataTypes.DATE, defaultValue: Date.now },
}, { sequelize, modelName: 'booking' });

sequelize.sync();

module.exports = { Booking };