'use strict';

const
  PokemonsController = require('../controllers/pokemons'),
  AuthentificationController = require('../controllers/authentification');


module.exports = (app) => {
  app.get(
    '/pokemons/:id',
    PokemonsController.getPokemonById
  );
  app.get(
    '/pokemons/page/:page',
    PokemonsController.setPokemonsQuery,
    PokemonsController.pagination
  );
  app.get(
    '/pokemons/caught/page/:page',
    AuthentificationController.checkToken,
    PokemonsController.setCaughtPokemonsQuery,
    PokemonsController.pagination
  );
  app.put(
    '/pokemons/:id/catch',
    AuthentificationController.checkToken,
    PokemonsController.catchPokemon
  );
};