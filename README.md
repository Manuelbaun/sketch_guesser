# SketchGuessr

Dieses Projekt stellt eine unvollständige Implementierung des SketchGuessrs Konzept dar. Momentan ist das Erstellen oder das Beitreten eines Spiels möglich. 

Der Spieler wird in einem Warteraum gebracht, der alle verbundenen Spiele aufzeigt. Es kann der Name geändert werden. 

Mit dem Controllern oben am Bildschirm, kann eine Spielsession gestartet werden.
Anschließen öffnet sich die Spielsession.

Momentan ist keine richtige Spiellogik enthalten. So kann jeder eine Nachricht verschicken und auf der Zeichenoberfläche zeichnen.

Das Spiel wird auf Netlify gehostet und kann unter diesem [SketchGuessr](https://sketchguessr.netlify.com/) erreicht werden. 

## Installations des Projekts

1. NodeJS muss mindestens in Version v12.4.0 installiert sein.
2. `npm install` ausführen
3. `npm start` ausführen.

## Generierung der PUML Datein
Ist das Paket `tplant` installiert, kann mit dem Befehl `npm run doc.tplant` eine puml Datei generiert werden, die die Komponenten darstellt. 
mit dem Befehl '`npm run doc.tplant.svg` wird eine SVG Datei erzeugt. Beide Dateien werden in dem Ordner puml liegen.


Eventuel muss die Grafikengine GraphViz installiert werden [GraphViz](https://www.graphviz.org/)