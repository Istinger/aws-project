const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

// settings
app.set('puerto', process.env.PORT || 3000);
app.set('nombreApp', 'Gestión de empleados');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/empleados', require('./routes/empleados.routes'));

module.exports = app;
