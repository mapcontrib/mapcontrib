

db.theme.drop();
db.poiLayer.drop();



db.user.createIndex( { 'osmId': 1 }, { 'unique': true } );
db.theme.createIndex( { 'fragment': 1 }, { 'unique': true } );
db.poiLayer.createIndex( { 'themeId': 1 } );



db.theme.insert({

	'_id' : ObjectId('5249c43c6e789470197b5973'),
	'name': 'Rudomap',
	'description': 'Ceci est une description :)',
	'fragment': 's8c2d4',
	'color': 'blue',
	'tiles': [

		'osmFr',
		'osmRoads',
		'transport',
		'osmMonochrome',
	],
	'zoomLevel': 12,
	'center': {

		'lat': 44.82921,
		'lng': -0.5834,
	},
});



db.poiLayer.insert({

	'_id' : ObjectId('5249c43c6e789470197b5974'),
	'themeId': '5249c43c6e789470197b5973',
	'name': 'Déchèteries',
	'description': 'Déchèteries, centres de tri, etc.',
	'overpassRequest': "(node['amenity'='recycling']['recycling_type'='centre']({{bbox}});relation['amenity'='recycling']['recycling_type'='centre']({{bbox}});way['amenity'='recycling']['recycling_type'='centre']({{bbox}}));out body center;>;out skel;",
	'minZoom': 14,
	'popupContent': '# Nom : {name}\n\n_Amenity :_ {amenity}',
	'order': 0,
	'markerShape': 'marker1',
	'markerColor': 'green',
	'markerIcon': 'recycle',
});

db.poiLayer.insert({

	'_id' : ObjectId('5249c43c6e789470197b5975'),
	'themeId': '5249c43c6e789470197b5973',
	'name': 'Poubelles',
	'description': 'Poubelles de toutes sortes',
	'overpassRequest': "(node['amenity'='waste_basket']({{bbox}});relation['amenity'='waste_basket']({{bbox}});way['amenity'='waste_basket']({{bbox}}));out body center;>;out skel;",
	'minZoom': 14,
	'popupContent': '# Nom : {name}\n\n_Amenity :_ {amenity}',
	'order': 1,
	'markerShape': 'marker1',
	'markerColor': 'yellow',
	'markerIcon': 'trash',
});
