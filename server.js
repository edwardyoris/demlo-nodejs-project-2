require('dotenv').config();
const app = require('./app');
const { db } = require('./database/db');
const initModel = require('./models/initModels');

db.authenticate()
  .then(() => console.log('Base de datos autenticada'))
  .catch((err) => console.log(err));

initModel();

db.sync()
  .then(() => console.log('Base de datos sincronizada'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}! 🥳`);
});
