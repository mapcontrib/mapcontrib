# MapContrib


## Contributing with translations

We plan to use [Transifex](http://www.transifex.com) in the future, stay tuned.


## Contributing with code

### Installation

	$ sudo npm install -g grunt grunt-cli bower
	$ npm install
	$ bower install
	$ grunt


### Branches

We use [Git Flow](https://github.com/nvie/gitflow) to manage our branches. It means that the master branch is always clean and pointing to the latest public release.


### Database

We use MongoDB, go to the `db` directory and execute `import_database.sh`. It will create a database called **rudomap**.

### Automatic tasks

A Grunt task watch the files modifications and generate CSS from Less, JST templates from HTML, etc.

You just need to launch:

	$ grunt watch


The server have to be launched with the command:

	$ node src/server.js

It serves static files and provide the REST API.


### Build

When your done, you can build a minified version of all the Javascript files and clean up a bit the folders by launching:

	$ grunt build

A new directory called **dist** will contain your shiny new MapContrib.


## Thanks

MapContrib is what it is because of some crazy people and free and open source projects. Let's name a few:

* Vincent Bergeot: Just the MapContrib's daddy...
* Guillaume Amat : Just the MapContrib main developer...
* Frédéric Rodrigo: The force he has ([Osmose](https://github.com/osm-fr/osmose-backend))
* Yohan Boniface ([uMap](https://bitbucket.org/yohanboniface/umap), [Leaflet-Storage](https://github.com/yohanboniface/Leaflet.Storage))
* Nohémie Lehuby ([OpenBeerMap](https://github.com/OpenBeerMap/OpenBeerMap.github.io))
* OpenStreetMap ([OSM](http://osm.org))
* Leaflet ([Website](http://leafletjs.com))
