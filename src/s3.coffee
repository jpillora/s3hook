ACCESS_KEY = 'accessKeyId'
SECRET_KEY = 'secretAccessKey'

#currently supported endpoints
slaves =
  "https://s3.amazonaws.com":"/jpillora-usa/proxy.html",
  "https://s3-ap-southeast-2.amazonaws.com":"/jpillora-aus/proxy.html"

xdomain { slaves }

endpoints = []  
endpoints.push e for e of slaves

#private config
config = {}


#signer
hashing.hmac_hash = hashing.sha1
hash = (key, str) ->
  encoding.base64_encode(encoding.hstr2astr(hashing.HMAC(key,str)))

ajax = (opts, callback = ->) ->

  throw "NO AWS ACCESS SET" unless config[ACCESS_KEY]
  throw "NO AWS SECRET SET" unless config[SECRET_KEY]
  
  auth = "AWS "+ config[ACCESS_KEY] + ":"
  method = opts.method or 'GET'
  url = opts.url or ''
  path = url.replace(/https?\:\/\/[^\/]+/,'')
  type = if method isnt 'GET' and /\.(\w+)$/.test(path) then MIME_TYPES[RegExp.$1] else ''
  # type = if method is 'GET' then '' else 'application/x-www-form-urlencoded; charset=UTF-8'
  date = new Date().toUTCString()
  body = opts.body

  xhr = new XMLHttpRequest()
  xhr.open method, url

  amz = []
  headers = {}
  setHeader = (header, val) ->
    xhr.setRequestHeader header, val
    if /^x-amz/i.test(header)
      amz.push header.toLowerCase()+":"+val
    headers[header] = val

  #set date for aws
  setHeader 'Content-Type', type if type
  setHeader 'x-amz-date', date

  #sign request
  message = [method, "", type, "", amz.join("\n"), path].join("\n")

  #handle headers
  for header,value of opts.headers
    setHeader header, value

  #finally, sign and set
  setHeader "Authorization", auth + hash(config[SECRET_KEY], message)
  
  xhr.onreadystatechange = ->
    if xhr.readyState is 4
      callback {
        url: url
        status: xhr.status
        requestHeaders: headers
        responseHeaders: xhook.headers xhr.getAllResponseHeaders()
        responseText: xhr.responseText
      }

  xhr.send body

#public methods
window.S3 =
  
  endpoints: endpoints

  set: (obj) ->
    config[k] = v for k,v of obj

  getObject: (url, callback) ->
    ajax({ method: "GET", url }, callback)

  putObject: (url, val, callback) ->
    ajax({ method: "PUT", url, body: val }, callback)
