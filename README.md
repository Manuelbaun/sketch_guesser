# Disclaimer

This Game is not a real game yet and misses the actual game logic. But you can check it out here [SketchGuessr](https://sketch-guesser.netlify.app/)

# SketchGuessr

SketchGuesser is a React PWA Game. The was a uni project and tries to implement a p2p game setup. It uses [yjs](http://y-js.org/) as the underlying and concurrent layer. The player communicate via WebRTC, so if WebRTC is not supported player are not able to play this game.

The author of yjs provides some WebRTC signaling Server and this is uses to connect players with each other. It also supports rooms for different game sessions.

## Build this project

1. min version of NodeJS `v12.4.0`
2. `npm install`
3. `npm start`


## Generating PUML Documentation

1. install `tplant` via `npm -D tplant` if not already
2. generate docs `npm run doc.tplant`
3. `npm run doc.tplant.svg` to generate the SVGs

**The project documentation can be found under the folder `puml`.
**[GraphViz](https://www.graphviz.org/) must be installed to generate the SVGs.
