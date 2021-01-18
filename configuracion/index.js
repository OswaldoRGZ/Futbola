require('dotenv').config();

const config = {
    dev: process.env.NODE_ENV !== 'production',
    puerto: process.env.PORT || 80,
};

module.exports = {config};