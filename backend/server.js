const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./app/models');
const mongoose = require('mongoose');

// Import routes
const movieRoutes = require('./app/routes/movie.routes');
const userRoutes = require('./app/routes/user.routes');
const artistRoutes = require('./app/routes/artist.routes');
const genreRoutes = require('./app/routes/genre.routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/genres', genreRoutes);

// Mongoose setup
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to the database!');
    })
    .catch(err => {
        console.error('Cannot connect to the database:', err);
        process.exit();
    });

// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
