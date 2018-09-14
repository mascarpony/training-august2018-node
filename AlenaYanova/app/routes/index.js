'use strict';

const pokemonsRoutes = require('./pokemons_routes');
const authRoutes = require('./auth_routes');

module.exports = (app) => {
  pokemonsRoutes(app);
  authRoutes(app);
};