const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; // Utiliza el puerto proporcionado por Heroku o el puerto 3000 si se ejecuta localmente
const routes = require('./api/endPoints');
const cors = require('cors');

// Ruta para la raíz de la aplicación
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi aplicación!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["http://localhost:3000", "https://tangerine-dasik-acc611.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Utiliza las rutas definidas en routes
app.use('/', routes);

app.listen(PORT, () => {
  console.log("Corriendo en el puerto " + PORT);
});
