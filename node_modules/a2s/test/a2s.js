var vows = require('vows')
  , assert = require('assert')
  , A2SRenderer = require('../')
  , SAMPLE_TEXT

SAMPLE_TEXT = '#---#\n|   |\n#---#\nHello'

vows.describe('A2S').addBatch({
  'Renderer': {
    topic: new A2SRenderer(),
    'render': {
      topic: function (renderer) {
        renderer.render({
          text: SAMPLE_TEXT
        }, this.callback)
      },
      'should render provided text as an SVG diagram': function (svg) {
        assert(svg)
        // TODO: Check the contents in some reasonably future-proof way.
      }
    }
  }
}).export(module)
