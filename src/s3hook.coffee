ACCESS_KEY = 'accessKeyId'
SECRET_KEY = 'secretAccessKey'

#setup xdomain
slaves =
  "https://s3.amazonaws.com":"/jpillora-usa/xdomain/proxy.html",
  "https://s3-ap-southeast-2.amazonaws.com":"/jpillora-aus/xdomain/proxy.html"

#setup xdomain AFTER s3hook
xdomain { slaves }

#private configs
configs = []

#signer
hashing.hmac_hash = hashing.sha1
sign = (key, str) ->
  encoding.base64_encode(encoding.hstr2astr(hashing.HMAC(key,str)))

#setup xhr hook
init = ->
  init = -> #noop
  xhook.before (request) ->

    #parse url
    url = xdomain.parseUrl request.url
    unless url and url.path and slaves[url.origin]
      return

    config = null
    for name, c of configs
      if c.path.test url.path
        config = c
        break

    unless config
      return

    #calculated path
    path = ''
    if /https?:\/\/(([^\.]+)\.)s3[\w-]*\.amazonaws.com/.test url.origin
      path += '/' + RegExp.$2
    path += url.path

    #content type headers
    typeName = hasContentType request.headers
    if typeName 
      type = request.headers[typeName]
    else if request.body
      type = request.headers['Content-Type'] = 'text/plain; charset=UTF-8'
    else
      type = ''
    type = type.replace /utf-/, 'UTF-'

    #require date header
    request.headers['x-amz-date'] = new Date().toUTCString()

    #extract amz headers
    amz = []
    for header,value of request.headers
      if /^x-amz/i.test(header)
        amz.push header.toLowerCase()+":"+value

    #sign request
    message = [request.method, "", type, "", amz.join("\n"), path].join("\n")

    # console.log "SIGNING\n===\n#{message}\n===\n"

    #finally, sign and set
    request.headers["Authorization"] =  "AWS #{config.access}:#{sign(config.secret, message)}" 
    return
  #first hook
  , 0

  #convert response xml to json
  xhook.after (request, response) ->

    return unless s3hook.xml2json

    typeName = hasContentType response.headers
    return unless typeName

    type = response.headers[typeName]
    if /\/xml$/.test type
      try
        xml = str2xml response.text
        obj = xml2json xml
        json = JSON.stringify obj, null, 2
        response.headers[typeName] = 'application/json'
        response.text = json
    return

#private helpers

hasContentType = (headers) ->
  for h of headers
    if /^content-type$/i.test h
      return h
  return

#public api
s3hook = set = (access, secret) ->
  add 'DEFAULT', access, secret
clear = ->
  add 'DEFAULT', access, secret
add = (name, access, secret, path = /.*/) ->
  configs[name] = {access, secret, path}
  init()
  return
remove = (name) ->
  delete configs[name]

proxy = (url) ->
  p = xdomain.parseUrl url
  return unless p and p.path
  slaves[p.origin] = p.path
  xdomain {slaves}

s3hook.xml2json = true
s3hook.set = set
s3hook.clear = clear
s3hook.add = add
s3hook.remove = remove
s3hook.encoding = encoding
s3hook.hashing = hashing
s3hook.proxy = proxy
s3hook.endpoints = ->
  e = []
  e.push(s) for s of slaves
  e

#public methods
window.s3hook = s3hook

  
