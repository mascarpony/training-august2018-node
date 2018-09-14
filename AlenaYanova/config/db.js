const { DB_USER, DB_PWD, DB_HOST, DB_PORT, DB_NAME } = process.env;

module.exports = {
  url: (DB_USER && DB_PWD)?
    `mongodb://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`:
    `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  options: { useNewUrlParser: true }
};