




db.theme.drop();

db.theme.insert({

	'_id' : ObjectId('5249c43c6e789470197b5973'),
	'name': 'Rudomap',
	'description': 'Ceci est une description :)',
	'fragment': 's8c2d4',
	'color': 'blue',
	'pois': [],
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



db.poiLayer.drop();

db.poiLayer.insert({

	'_id' : ObjectId('5249c43c6e789470197b5974'),
	'themeId': '5249c43c6e789470197b5973',
	'name': 'Déchèteries',
	'description': 'Déchèteries, centres de tri, etc.',
	'overpassRequest': "(node['amenity'='recycling']['recycling_type'='centre'](BBOX);relation['amenity'='recycling']['recycling_type'='centre'](BBOX);way['amenity'='recycling']['recycling_type'='centre'](BBOX));out body center;>;out skel;",
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
	'overpassRequest': "(node['amenity'='waste_basket'](BBOX);relation['amenity'='waste_basket'](BBOX);way['amenity'='waste_basket'](BBOX));out body center;>;out skel;",
	'minZoom': 14,
	'popupContent': '# Nom : {name}\n\n_Amenity :_ {amenity}',
	'order': 1,
	'markerShape': 'marker1',
	'markerColor': 'yellow',
	'markerIcon': 'trash',
});
