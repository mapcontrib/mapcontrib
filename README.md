[![Build Status](https://api.travis-ci.org/MapContrib/MapContrib.svg?branch=develop)](http://travis-ci.org/MapContrib/MapContrib)

# ![MapContrib](logo.png)

> Thematic OpenStreetMap contribution

![MapContrib](screenshot.png)


## Contribution

Informations about contributing are available in the [CONTRIBUTING.md](CONTRIBUTING.md) file.


## Installation

    $ git clone https://github.com/MapContrib/MapContrib.git
    $ cd MapContrib
    $ npm install
    $ npm run build
    $ npm test

It will install all the dependancies and test the code.


## Launch the server

By default the application will be available at [http://localhost:8080](http://localhost:8080).

### Docker Compose

To launch the Node.js based server.

    $ docker-compose up

MongoDB is rather slow to create the database files the first time... The Node.js container will surely break.
Just wait a few seconds and rerun the up command.

Then, you will have to initialize the database, in antoher terminal simply run:

    $ docker-compose run node npm run init

### Manual

You must have a MongoDB server running on localhost. To initialize the database the first time, run:

    $ npm run init

To launch the Node.js based server.

    $ npm start


## Thanks

MapContrib is what it is because of some crazy people and free and open source projects. Let's name a few:

* Vincent Bergeot: MapContrib's daddy
* Guillaume Amat: MapContrib's main developer
* Frédéric Rodrigo: The force he has ([Osmose](https://github.com/osm-fr/osmose-backend))
* Yohan Boniface ([uMap](https://bitbucket.org/yohanboniface/umap), [Leaflet-Storage](https://github.com/yohanboniface/Leaflet.Storage))
* Noémie Lehuby ([OpenBeerMap](https://github.com/OpenBeerMap/OpenBeerMap.github.io))
* OpenStreetMap ([OSM](http://osm.org))
* Leaflet ([Website](http://leafletjs.com))
* Overpass API ([Website](http://www.overpass-api.de), [Overpass Turbo](http://overpass-turbo.eu))
* Mapbox ([Website](https://www.mapbox.com))
