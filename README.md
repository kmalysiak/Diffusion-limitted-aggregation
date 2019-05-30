# Diffusion Limited Growth

This project is a numerical simulation of Diffusion Limited Aggregation process (abbrev. as DLA).
Proces simulates movement of random walking particles and their aggregation on a lattice. Process starts with a seed located at the center.
A particle enters the scene and starts random walking until it encounters the seed. It then gets immobilised and another particle
is placed and allowed to random walk. Once it encounters the seed or a previously aggregated particles it aggregates and becomes
immobilised. Process repeats what leads to growth of an aggregate with fractal dimension approx. 1.6.

## Getting Started

### Installing

* download repo
* install node
* install webpack
* install babel
* install webpack-dev-server for convenient debug

## Development

Run

```console
webpack-dev-server
```

to start a webpack-dev-server for easy development. To a running instance of dev-server you can attach a debug from Visual Studio for real-time debug / breakpoint / check variables.

Run

```console
npm run-script build
```

to build a project into deployment folder and keep webpack running in a mode of constant check of changes to source files and real-time on-change deployment.

## Contributing

## Authors

Krzysztof Małysiak

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
