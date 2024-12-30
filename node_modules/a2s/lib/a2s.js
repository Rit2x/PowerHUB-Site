var request = require('request')

//
// # A2SRenderer
//
function A2SRenderer(obj) {
  if (!(this instanceof A2SRenderer)) {
    return new A2SRenderer(obj)
  }

  obj = obj || {}

  this.url = this.url || obj.url || 'http://api.a2saas.com'
}
A2SRenderer.A2SRenderer = A2SRenderer

//
// ## parse `parse(options, callback)`
//
// Parses **options.text**, replacing all blocks delimited by **options.boundary** with their SVG counterparts.
//
// Returns the replaced version of **options.text**.
//
A2SRenderer.prototype.parse = parse
function parse(options, callback) {
  var self = this
    , text = options.text
    , boundary = options.boundary
    , regex = new RegExp(boundary, 'g')
    , original = null
    , start
    , end

  function parseChunk(err, content) {
    if (err) {
      callback(err)
      return
    }

    if (original) {
      text = text.replace(original, content)
    }

    start = regex.exec(text)
    end = regex.exec(text)

    if (start && end) {
      original = text.slice(start.index, end.index + boundary.length)

      self.render({
        text: text.slice(start.index + boundary.length, end.index)
      }, parseChunk)
    } else {
      callback(null, text)
    }
  }
  parseChunk()
}

//
// ## render `render(options, callback)`
//
// Renders **options.text** to SVG.
//
// Returns the SVG content.
//
A2SRenderer.prototype.render = render
function render(options, callback) {
  var self = this
    , text = options.text

  self.put({
    text: text
  }, function (err, id) {
    if (err) {
      callback(err)
      return
    }

    self.get({
      id: id
    }, callback)
  })
}

//
// ## put `put(options, callback)`
//
// PUTs **options.text** to the supplied host.
//
// Returns the new ID.
//
A2SRenderer.prototype.put = put
function put(options, callback) {
  var self = this
    , text = options.text

  request.put({
    url: self.url + '/put.php',
    body: text
  }, function (err, response, body) {
    if (err) {
      callback(err)
      return
    }

    if (body.error) {
      callback(body.error)
      return
    }

    callback(null, JSON.parse(body).success)
  })
}

//
// ## get `get(options, callback)`
//
// GETs **options.id** from the supplied host.
//
// Returns the SVG contents.
//
A2SRenderer.prototype.get = get
function get(options, callback) {
  var self = this
    , id = options.id

  request.get({
    url: self.url + '/get.php',
    qs: {
      id: id
    }
  }, function (err, response, body) {
    if (err) {
      callback(err)
      return
    }

    if (body.error) {
      callback(body.error)
      return
    }

    callback(null, JSON.parse(body).svg)
  })
}

module.exports = A2SRenderer
