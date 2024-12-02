const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const FILE_PATH = './repertorio.json';

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Leer el JSON
const readJSON = () => JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));

// Escribir en el JSON
const writeJSON = (data) => fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');

// Rutas API
app.get('/canciones', (req, res) => {
  try {
    const canciones = readJSON();
    res.json(canciones);
  } catch {
    res.status(500).send('Error al leer el archivo JSON.');
  }
});

app.post('/canciones', (req, res) => {
  try {
    const nuevaCancion = req.body;
    const canciones = readJSON();
    canciones.push(nuevaCancion);
    writeJSON(canciones);
    res.status(201).send('Canción agregada exitosamente.');
  } catch {
    res.status(500).send('Error al agregar la canción.');
  }
});

app.put('/canciones/:id', (req, res) => {
  try {
    const { id } = req.params;
    const canciones = readJSON();
    const index = canciones.findIndex((c) => c.id == id);
    if (index === -1) return res.status(404).send('Canción no encontrada.');
    canciones[index] = { ...canciones[index], ...req.body };
    writeJSON(canciones);
    res.send('Canción actualizada exitosamente.');
  } catch {
    res.status(500).send('Error al actualizar la canción.');
  }
});

app.delete('/canciones/:id', (req, res) => {
  try {
    const { id } = req.params;
    const canciones = readJSON();
    const nuevasCanciones = canciones.filter((c) => c.id != id);
    if (canciones.length === nuevasCanciones.length) {
      return res.status(404).send('Canción no encontrada.');
    }
    writeJSON(nuevasCanciones);
    res.send('Canción eliminada exitosamente.');
  } catch {
    res.status(500).send('Error al eliminar la canción.');
  }
});

// Servir la aplicación HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
