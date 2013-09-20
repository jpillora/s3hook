ACCESS_KEY = 'accessKeyId'
SECRET_KEY = 'secretAccessKey'

#setup xdomain
slaves =
  "https://s3.amazonaws.com":"/jpillora-usa/xdomain/proxy.html",
  "https://s3-ap-southeast-2.amazonaws.com":"/jpillora-aus/xdomain/proxy.html"

#setup xdomain AFTER s3hook
xdomain { slaves }

#available endpoints
endpoints = []  
endpoints.push e for e of slaves

#private configs
configs = []

#signer
hashing.hmac_hash = hashing.sha1
sign = (key, str) ->
  encoding.base64_encode(encoding.hstr2astr(hashing.HMAC(key,str)))

#setup xhr hook
init = ->
  console.log 'init!'
  init = ->
  xhook.before (request) ->

    #parse url
    url = xdomain.parseUrl request.url
    unless url and url.path and slaves[url.origin]
      console.log 's3hook skipping: ' + request.url
      return

    config = null
    for name, c of configs
      if c.path.test url.path
        config = c
        break

    unless config
      console.log 's3hook blocking path: ' + request.path
      return

    #content type headers
    request.headers['Content-Type'] = 'text/plain; charset=UTF-8' if request.method isnt 'GET'
    type = request.headers['Content-Type']

    #require date header
    request.headers['x-amz-date'] = new Date().toUTCString()

    #extract amz headers
    amz = []
    for header,value of request.headers
      if /^x-amz/i.test(header)
        amz.push header.toLowerCase()+":"+value

    #sign request
    message = [request.method, "", type, "", amz.join("\n"), url.path].join("\n")

    #finally, sign and set
    request.headers["Authorization"] =  "AWS "+ config.access + ":" + sign(config.secret, message)
    console.log 'signed!'
    return

  #first hook
  , 0

set = (access, secret) ->
  add 'DEFAULT', access, secret

clear = ->
  add 'DEFAULT', access, secret

add = (name, access, secret, path = /.*/) ->
  configs[name] = {access, secret, path}
  init()
  return

remove = (name) ->
  delete configs[name]

set.encoding = encoding
set.hashing = hashing
set.endpoints = endpoints

#public methods
window.s3hook = set

  
