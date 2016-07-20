# Changelog

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
