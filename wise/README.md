# «WISE»
#### World Institute of Scientology Enterprises International Business Directory, 2006


**Datenquelle**:
[WikiLeaks](https://wikileaks.org/wiki/World_Institute_of_Scientology_Enterprises_International_Business_Directory,_text,_2006)


### Tools

#### `parse.py`

Liest den Ausgangsdatensatz ein, erkennt Abschnitte (Branchen),
Unternehmensnamen, Adressblöcke, etc. und produziert eine strukturierte Datei
im JSON-Format.


#### `geocode.py`

Liest die mit `parse.py` erstellte Datei ein, geht alle Unternehmen durch und
fügt mittels [GeoPy](http://geopy.readthedocs.org/) und [Google Maps Geocodeing API](https://developers.google.com/maps/documentation/geocoding/?hl=de)
Koordinaten hinzu.
