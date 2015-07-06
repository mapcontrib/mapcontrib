




db.profile.drop();

db.profile.insert({

	'_id' : ObjectId('5249c43c6e789470197b5973'),
	'name': 'Rudomap',
	'description': 'Ceci est une description :)',
	'color': 'blue',
	'pois': [],
	'tiles': [],
	'zoomLevel': 12,
	'center': {

		'lat': 44.82921,
		'lng': -0.5834,
	},
});



db.poiLayer.drop();

db.poiLayer.insert({

	'_id' : ObjectId('5249c43c6e789470197b5974'),
	'profileId': '5249c43c6e789470197b5973',
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
	'profileId': '5249c43c6e789470197b5973',
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
