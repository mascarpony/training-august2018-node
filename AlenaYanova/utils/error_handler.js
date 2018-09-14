'use strict';

exports.handleError = (err, res) => {
  if (err) {
    res.status(500).json({error: 'Something wrong was happened.'});
  }
};