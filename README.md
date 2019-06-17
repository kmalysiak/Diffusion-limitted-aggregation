
![](https://img.shields.io/badge/BROWSER-SUPPORTED-brightgreen.svg)

# Diffusion Limited Aggregation

This project is a numerical simulation of Diffusion Limited Aggregation process (abbrev. as DLA). It simulates movement of random walking particles (aka. Brownian Particle) and their aggregation on a lattice. Process starts with a seed located at the center.
A particle enters the scene and starts random walking until it encounters the seed. It then gets immobilised and another particle
is placed and allowed to random walk. Once it encounters the seed or a previously aggregated particles it aggregates and becomes
immobilised. Process repeats what leads to growth of an aggregate with fractal dimension approx. 1.6. 

Some expressive video that may help you to better understant the process may be found [here](https://www.youtube.com/watch?v=I4VAIkrY4yw) on YouTube.

## Getting Started

### Installing

* clone repository to a selected local folder
* install [Node.js](https://nodejs.org/en/)
* open console and cd to the repository folder

* run the following command to install necessary packages
  
  ```
  npm install 
  ```
  
  most notably webpack, babel and webpack-dev-server will be installed and all necessary dependencies 
  
 * project should be ready to be opened easily with WebStorm IDE or Visual Studio Code;

### Building

* type in console (or directly from IDE)
  ```
  npm run build
  ```
  this will start webpack in the watch mode - any change to source files will triger automatic webpack build to `dist` folder

### Deploy

* content of the `dist` directory can be deployed on the chosen web server

* for local tests or development run from console of IDE

  ```
  webpack-dev-server
  ```
  this will start the instance of web server at `localhost:9000`; server is started at watch mode - any changes to sources will cause webpack build and redeploy on the server; note that to this instance a debugger from WebStorm or VisualStudioCode can be attached; for the debugging purposes I recommend WebStorm as this seems to be the only IDE capable of debugging web workers.

## Contributing
Leave a message if you want to contribute.

## Authors

Krzysztof Małysiak - this project has been development in my limited free time to have some fun with `JS`.

## License

Copyright (c) [2019] [Krysztof Małysiak]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Acknowledgments

I would like to acknowledge Marjin Haverbeke for his outstanding book [Eloqunet JavaScript](https://eloquentjavascript.net/) reading of which was pure pleasure and well inspiring.

