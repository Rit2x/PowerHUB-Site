# A2S

A simple library to interface with the handy [A2S API](http://www.a2saas.com/) for converting ASCII Art into SVGs.

## Usage example

If installed with `npm install -g a2s`, try:

    a2s example.txt > example.png

Otherwise:

    var A2SRenderer = require('a2s')
      , renderer = new A2SRenderer()

    renderer.render({
      text: 'SVG is Awesome!\n---------------->'
    }, console.log.bind(console, 'RESPONSE:'))
