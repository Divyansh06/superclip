const express = require('express');
const morgan = require('morgan')
const clipRoutes = require('./api/routes/clips');
const userRoutes = require('./api/routes/users');
const authRoutes = require('./api/routes/auth');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", " GET, POST, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

app.use('/clips', clipRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use((req, res, next) => {
    res.status(200).json({
        message: "It Works!"
    })
})

// Error handling middleware
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Global error handler
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;