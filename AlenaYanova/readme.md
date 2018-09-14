# Server-Pokedex

Pokedex REST API with NodeJS, Express, MongoDB. 
 
## Getting started

This instructions will get you run this amazing app.

### Installing

Install all packages.

```
npm install
```

### Setting env variables

Create `.env` and fill in according `env.example`.

### Database initialization

Run script for creating pokemons collection in database.

```
npm run dbinit
```

## API

Routes for Pokedex. For all queries use header `"Content-Type": "application/x-www-form-urlencoded"`.

### Auth Routes

#### Registration

For register new user use `POST` query for rout

```
/register
```

with body

```
{
    "email": "your_email@example.com",
    "password": "your_password",
    "name": "your_name"
}
```
 
In response you will get jwt token. 

```
{
    "token": "your_token"
}
```

#### Login

For login use `POST` query for rout

```
/login
```

with body

```
{
    "email": "your_email@example.com",
    "password": "your_password"
}
```

In response you will get jwt token.

```
{
    "token": "your_token"
}
```

### Pokemons

#### Get one pokemon

For this purpose use `GET` query for rout

```
/pokemons/:id
```

You will get something like

```
{
    "catchInfo": {
        "isCaught": false
    },
    "name": "bulbasaur",
    "id": 1
}
```

#### Get many pokemons

Use `GET` query for rout

```
/pokemons/page/:number
```

The default number of pages is 10. Use the optional parameter to change the number of pokemons per page.

```
/pokemons/page/:number?perPage=20
```

You will get json

```
{
    "pokemons": ["all_pokemons_on_this_page"],
    "page": 1,
    "pages": 94
}
```

#### Get caught pokemons

Only for authorized users. For authorization, add a title `"x-access-token": "your_token"`.

Use `GET` query

```
/pokemons/caught/page/:number
```

Changes in number of pokemons per page and response are similar to previous rout.

#### Catch pokemon

Only for authorized users. For authorization, add a title `"x-access-token": "your_token"`.

Use `PUT` query

```
/pokemons/catch/:id
```

In response you wil get json

```
{
    "catchInfo": {
        "isCaught": true,
        "userId": "your_id",
        "timestamp": "date_of_cathing"
    },
    "_id": "pokemon_db_id,
    "name": "pokemon_name",
    "id": "pokemon_id",
    "__v": 0
}
```