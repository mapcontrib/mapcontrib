# Rudomap



## Développement


### Installation des dépendances

	$ sudo npm install -g grunt grunt-cli bower
	$ npm install
	$ bower install
	$ grunt


### Pendant le travail

Il y a une tâche Grunt qui permet de surveiller les fichiers et de compiler automatiquement les templates, les fichiers LESS, de copier des fichiers, etc.

	$ grunt watch


Pour lancer le server Node qui sert les fichiers statiques et qui fournit l'API

	$ node src/server.js


### Compilation

Pour compiler la version destinée à la production, faire un

	$ grunt build

Le résultat de la compilation se trouve dans le dossier _dist_.
