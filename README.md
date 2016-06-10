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

    $ docker-compose up


### Manual

You must have a MongoDB server running on localhost.

    $ npm start

It launches the Node.js based server.


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
