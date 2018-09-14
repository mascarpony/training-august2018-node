'use strict';

const
  Pokemon = require('../models/pokemon'),
  url_parse = require('url').parse,
  handleError = require('../../utils/error_handler').handleError;

exports.getPokemonById = (req, res) => {
  const details = { 'id': req.params.id };
  Pokemon.findOne(details)
    .select({ 'catchInfo.userId': 0, '_id': 0, '__v': 0 })
    .then(pokemon =>
      res.status(200).send(pokemon))
    .catch(err => handleError(err, res))
};

exports.pagination = (req, res) => {
  const isAuth = !!(req.headers['x-access-token']);
  const
    query = url_parse(req.url, true).query,
    perPage = query.perPage? +query.perPage: 10,
    page = Math.max(0, req.params.page);
  Pokemon.find(req.details)
    .skip(perPage * (page - 1))
    .limit(perPage)
    .sort('id')
    .select(isAuth? { 'catchInfo.userId': 0, '_id': 0, '__v': 0 }: { 'catchInfo': 0, '_id': 0, '__v': 0 })
    .then(pokemons => {
      return { count: Pokemon.countDocuments(req.details), pokemons }
    })
    .then(({ count, pokemons }) => {
      count
        .then(count =>
          res.status(200).json({
            pokemons: pokemons,
            page: page,
            pages: count / perPage
          })
        )
    })
    .catch(err => {
      return handleError(err, res);
    });
};

exports.setPokemonsQuery = (req, res, next) => {
  req.details = {};
  next();
};

exports.setCaughtPokemonsQuery = (req, res, next) => {
  req.details = {
    'catchInfo.isCaught': true,
    'catchInfo.userId': req.user._id
  };
  next();
};

exports.catchPokemon = (req, res) => {
  const details = { 'id': req.params.id };
  Pokemon.findOne(details)
    .then(pokemon => {
      if (pokemon.catchInfo.isCaught){
        res.status(200).json({ message: 'Sorry, pokemon is caught' })
      } else {
        pokemon.catch(req.user._id);
        res.status(201).send(pokemon);
      }
    })
    .catch(err => handleError(err, res))
};