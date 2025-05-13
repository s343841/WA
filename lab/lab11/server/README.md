### Get all films

* `GET api/films/`
* Description: get the full list of films 
* Request body: _None_
* Response: `200 OK`
* Response body: Array of objects, each describing one film. Note the absence of values is represented as null in json.

```json
[
    { "id" : 1 , "title" : "Pulp Fiction" , "favorite" : 1 , "watchDate" : "2023-03-11" , "rating" : null},
    ...
]
```
* Error responses: `500 Internal Server Error (generic error)`


### Get film given an id

* `GET api/films/:id`
* Description: get the film from the id
* Request body: _None_
* Response: `200 OK`
* Response body: Film object. Note the absence of values is represented as null in json.

```json
[
    { "id" : 1 , "title" : "Pulp Fiction" , "favorite" : 1 , "watchDate" : "2023-03-11" , "rating" : null}
]
```
* Error responses: `500 Internal Server Error (generic error)`

### Add a film 

* `POST api/films/`
* Description: add a film without giving the id (handled in backend)
* Request body: Film object
* Response: `200 OK`
* Response body: string saying the film was added

```json
[
    { "title" : "Pulp Fiction" , "favorite" : 1 , "watchDate" : "2023-03-11" , "rating" : null,}
]
```
* Error responses: `500 Internal Server Error (generic error)`

### Mark an existing film favourite/unfavourite

* `PUT api/films/:id/change-favourite`
* Description: change the value of the field favorite
* Request body: Film object
* Response: `200 OK`
* Response body: _NULL_

```json
[
    { "favorite" : 1 }
]
```
* Error responses: `500 Internal Server Error (generic error)`

### Change the rating of a film

* `PUT api/films/:id/change-rating`
* Description: change the value of the field rating given a delta (eg. +1, -1)
* Request body: id, deltaRating
* Response: `200 OK`
* Response body: _NULL_

```json
[
    { "deltaRating" : +1 }
]
```
* Error responses: `500 Internal Server Error (generic error)`

### Delete a film

* `DELETE api/films/:id`
* Description: delete a film
* Request body: _NULL_
* Response: `200 OK`
* Response body: _NULL_

* Error responses: `500 Internal Server Error (generic error)`

### Get all favourite films

* `GET api/films/filter?favorite`
* Description: get all favourite films
* Request body: _NULL_
* Response: `200 OK`
* Response body: Array of objects, each describing one film.

* Error responses: `500 Internal Server Error (generic error)`

```json
[
    { "id" : 1 , "title" : "Pulp Fiction" , "favorite" : 1 , "watchDate" : "2023-03-11" , "rating" : null,}
]
```


### Get all best film

* `GET api/films/filter?rating`
* Description: get all films with rating 5
* Request body: _NULL_
* Response: `200 OK`
* Response body: Array of objects, each describing one film.

* Error responses: `500 Internal Server Error (generic error)`

```json
[
    { "id" : 1 , "title" : "Pulp Fiction" , "favorite" : 1 , "watchDate" : "2023-03-11" , "rating" : null,}
]
```

### Get all unseen film

* `GET api/films/filter?unseen`
* Description: get all unseen film
* Request body: _NULL_
* Response: `200 OK`
* Response body: Array of objects, each describing one film.

* Error responses: `500 Internal Server Error (generic error)`

```json
[
    { "id" : 1 , "title" : "Pulp Fiction" , "favorite" : 1 , "watchDate" : "2023-03-11" , "rating" : null,}
]
```


### Get all film seen last month

* `GET api/films/filter?lastmonth`
* Description: get all films seen on the last 30 days
* Request body: _NULL_
* Response: `200 OK`
* Response body: Array of objects, each describing one film.

* Error responses: `500 Internal Server Error (generic error)`

```json
[
    { "id" : 1 , "title" : "Pulp Fiction" , "favorite" : 1 , "watchDate" : "2023-03-11" , "rating" : null,}
]
```

### Update a film

* `PUT api/films`
* Description: update the informations of a given film
* Request body: Film to modify
* Response: `200 OK`
* Response body: _NULL_

* Error responses: `500 Internal Server Error (generic error)`

```json
[
    { "id" : 1 , "title" : "Pulp Fiction" , "favorite" : 1 , "watchDate" : "2023-03-11" , "rating" : null,}
]
```



