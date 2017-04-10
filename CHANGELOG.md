# Changelog

# 1.7.3

* Update the italian translations (thanks @napo!)
* Fix the theme localization feature.

# 1.7.2

* Remove the production config.
* Fix the Dockerfile volumes.

# 1.7.1

* Move to Docker Cloud for automated Docker image build.
* Add a link to the official Docker image to the README (useful links section).
* Add a script to build local Docker images.
* Set the production port to 80.

# 1.7.0

* An official MapContrib Docker image is now available on the Docker Hub!
* Upgrade the Docker Compose file to version 2.
* Allow the instance administrator to add custom tiles in its configuration ([see the wiki](https://github.com/MapContrib/MapContrib/wiki/Add-custom-tiles)).
* All the tiles can now put an automatic attribution in the contribution changesets.
* And as always, multiple bufixes and enhancement.

# 1.6.1

* Raise the payload limit to 50mb until I figure it more cleanly...

# 1.6.0

* The OSM monochrome, Watercolor and Mapbox street satellite tiles are now enabled by default.
* All the tiles are always available when clicking on a « display more » button in the tile selection column.
* The tags displayed in features popup content are no longer put on top of the contribution form.
* Read-only preset tag values overwrite existing tag values in the contribution form, the checkbox label has been changed to reflect the new behavior.
* Add some back buttons to columns.
* And as always, multiple bufixes and enhancement.

# 1.4.6

* Fix a regression introduced in the 1.4.0 version when displaying ways.

# 1.4.5

* Add a npm script to clean the obsolete layer files.

# 1.4.4

* Automatically clean the OverPass cache files when layers are removed.

# 1.4.3

* Update the italian translations.

# 1.4.2

* Update the screenshot for the 1.4 serie.
* Update the changeset comment, MapContrib is not a prototype anymore.

# 1.4.1

* Patch a Leaflet issue (https://github.com/Leaflet/Leaflet/issues/4578).
* Fix an issue leading to load the map without any request.

# 1.4.0

* Add the user own themes column.
* Add the user favorite themes column.
* Theme creators can now delete their themes.
* Logged in visitors can create their own themes based on visited ones.
* Add a proper 404 page (page not found fallback).
* And as always, multiple bufixes and enhancement.

# 1.2.4

* Enable the remove button on non-osm tags when contributing.

# 1.2.3

* Fix a margin in the preset selection column.

# 1.2.2

* Remove an unnecessary top border on the minimum zoom notification.

# 1.2.1

* Shuffle themes and layers before each OverPass cache generation.
* Better timeout detection during the OverPass cache genration.
* Fix the « out of memory » case in the OverPass cache generation.

# 1.2.0

* Display the user/visitor column on the home page.
* Add some project links in it.
* Remove the « Create theme » button from the home page as it is now in the new main menu.
* Add borders to different widgets to ease the navigation.

# 1.0.12

* Set maximum number of tries when the OverPass cron is failing for too many requests.

# 1.0.11

* Complete the Italian translation file.
* Improve the ownership verification when modifying a theme.

# 1.0.10

* Don't auto scroll at all on large screens.
* Don't reset the theme model after the main settings column close.

# 1.0.9

* Fix the tags translation progression calculation.

# 1.0.8

* Fix the tags translation edition column.

# 1.0.7

* Upgrade Passport & co.
* Fix: When no session, the reload method returns an error.

# 1.0.6

* Properly destroy the session when logging out.
* Set the session cookie maxAge to 90 days.
* Force the reload of the session when visiting the home and theme pages.

# 1.0.5

* Try to improve the server session handling.

# 1.0.4

* Split the javascript files to optimize their load time.
* Display a text input for check type fields when the set value is not yes or no.
* Display a text input for combo type fields when they are empty.

## 1.0.3

* Fix the popup contribution button route.

## 1.0.2

* Fix an undefined variable on race condition.

## 1.0.1

* Fix some font-size.

## 1.0.0

* A brand new tag and preset handling, inluding iD presets.
* The administrator can ask to not delete POI from the OverPass cache system if they are deleted from OSM (see cache archiving).
* Heat maps can be created with point based layers.
* The administrator can now force the use of https on his instance.
* The columns are a bit larger.
* Titles and zoom level are a bit bigger too.
* Change a Mongo request in order to be compatible with Mongo 2.x.
* Upgrade to Leaflet 1.0.1.
* And as always, multiple bufixes and enhancement.

## 0.12.17

* Fix duplicate elements when the layer cache is enabled.

## 0.12.16

* Fixes the default buttons background color.
* Display a proper message when a layer file is not found.

## 0.12.15

* Fixes missing english translations.

## 0.12.14

* Fixes the identifier of two localized strings in english and italian.

## 0.12.13

* Remove all comments from OverPass requests.

## 0.12.12

* Fixes the load of cached OverPass layers (again...).

## 0.12.11

* Fixes the load of cached OverPass layers.
* Fixes a typo in the french translations.
* Fixes a race condition on geocode searches.

## 0.12.10

* Small bugfix.

## 0.12.9

* Better handling of bounds when generating the OverPass cache.
* Don't relaunch an OverPass request whan toggling layers visibility.

## 0.12.8

* Switch the BANO tiles from https to http.

## 0.12.7

* Deletes the cached contributions older than a day ago.
* Casts attributes to integer when needed in the contribution cache.

## 0.12.6

* Fixes the marker customisation on Webkit/Blink based browsers.

## 0.12.5

* Fixes the display of cached contributions.

## 0.12.4

* Fixes the handling of ways/relations contribution cache.

## 0.12.3

* Fixes the POI's info display update after edition.

## 0.12.2

* Updates the Leaflet-OverPass-Layer plugin to the 2.1.1 version.
* When applying a preset on an existing POI, the original POI's values were missing.
* Fixes the POI edition form.

## 0.12.1

* Fixes the missing italian translations.
* Updates the README screenshot.

## 0.12.0

* Adds a button to download all the visible data from the current bounding box.
* Makes the layer info button more visible in the layer selection column.
* Deletes the layer OverPass cache when its generation failed.
* Introduces the temporary layers addition, available for both logged and anonymous users.
* Automatically re-launches OverPass requests when modified in the layer setting.
* Handles non-OSM tags (with file based tag values) when using presets (node's types).
* Proposes to apply a node's type on an existing POI when editing it.
* Makes the current position (zoom, latitude and longitude) available in the share link and iframe.
* Adds some hints in layers configuration columns.
* Removes the bottom left *help* button and places its former content in the *About* menu item (in the user column).
* Makes present POI less opaque when contributing.
* It is now possible for theme creator to configure an analytics javascript code to follow their theme visits. Instance's administrator can provide a code too, in order to follow the entire MapContrib instance visits.
* And as always, multiple bufixes and enhancement.

## 0.10.11

* Adds the OAuth endpoint in the configuration.

## 0.10.10

* Gives style to all the feature types.

## 0.10.9

* Fixes the fullscreen handling.
* Fixes the jquery-ui version.
* Sets the iframe height to 500 pixels.
* Fixes the polygon styles.
* Don't display empty modals/columns.

## 0.10.8

* Fixes the zoomChanged bindings.

## 0.10.7

* Fixes the theme titles display.

## 0.10.6

* Don't set the X-Frame-Options to permit the remote use of MapContrib.

## 0.10.5

* Updates the README's screenshot.
* Fixes an error on geolocation in some cases.
* Hides home placeholders when a search is in progress.
* Decreases the number of search requests in the home page.

## 0.10.4

* Don't execute OverPass requests when the layer is hidden.

## 0.10.3

* Don't expose POI edition when the layer is not an OverPass one.

## 0.10.2

* Fixes a translation.

## 0.10.1

* Fixes the first time login.

## 0.10.0

* When adding a new POI, the POI location method uses a fixed cross displayed on top of the map.
* Tag keys and values are now trimmed when contributing and setting presets.
* No more close button in popups as they can be closed by clicking elsewhere in the screen.
* The contribution button as now a pencil as icon.
* There is now another pencil icon in popups and its display is more convenient.
* It is now possible to move a POI (only node ones).
* New type of layers, based on GPX, CSV and GeoJSON files are added.
* There is a new layer information column. It displays OverPass requests, original data files and a button to download GeoJSON data.
* It is now possible to automatically center the theme on the user geolocation.
* The home page search results revert to highlighted themes when the search input is empty.
* The info button on contribution and preset fields is now active and send the user to the taginfo service.
* The geocoder search results provide more informations and are prettier.
* There is now a cache system to pre-fetch OverPass layers results.
* Automatically adds target blank on links in Markdown supported fields.
* Lets the possibility to display POI's infos in popups, modals or columns.
* And as always, multiple bufixes and enhancement.

## 0.8.10

* Uses the current HTTP protocol for tiles.
* Adds a `{s}` in the Lyrk tiles URL.

## 0.8.9

* Removes the MapQuest Open tiles.
* Fixes the OSM Monochrome tiles URL.

## 0.8.8

* Cleans up the root files.

## 0.8.7

* Adds the italian localization.

## 0.8.6

* Displays the right tiles on the home page.

## 0.8.5

* Fixes the versionning.

## 0.8.4

* Fixes the markers position.
* Fixes the display of the information button if title bar is white.

## 0.8.3

* Fixes the orientation handling in geolocation.

## 0.8.2

* Fixes dark-gray clusters display.

## 0.8.1

* Fixes the themes selection when logging in.

## 0.8.0

* There is now a proper home page, with search form and highlighted themes.
* No more double click to create a theme from the home page.
* Adds proper configuration files.
* Adds an automatic migration script, executed when the server is launched.
* Plugin Leaflet.MarkerCluster added.
* It is now possible to choose the geocoder betwwen Nominatim and Photon (default).
* Multiple fixes and other additions.
