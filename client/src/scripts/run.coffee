
xdomain.debug = false

angular.module("s3-demo", []).run(($rootScope, $timeout, $http) ->
  scope = window.root = $rootScope
  scope.hasLocalStorage = !!window.localStorage
  scope.running = false
  scope.fileBody = true
  scope.rememberKeys = true
  scope.endpoints = s3hook.endpoints()
  scope.headers = [{name: 'x-amz-acl', value: 'public-read'}]
  scope.methods = ["GET", "PUT", "POST", "DELETE"]
  scope.method = scope.methods[0]
  scope.endpoint = scope.endpoints[0]
  rememberFields = ["headers", "access", "secret", "rememberKeys", "method", "endpoint", "body", "path", "fileBody"]

  #state vars
  scope.loading = false

  scope.store = (key, value) ->
    return unless scope.hasLocalStorage
    if key is "access" or key is "secret"
      s3hook.set scope.access, scope.secret
      return  unless scope.rememberKeys
    if value is `undefined`
      localStorage.removeItem key
    else
      localStorage.setItem key, JSON.stringify(value)

  scope.updateHeaders = ->
    spare = -1
    full = true
    for i of scope.headers
      h = scope.headers[i]
      if not h.name or not h.value
        spare = +i  unless full
        full = false
    if full
      scope.headers.push {}
    else scope.headers.splice spare, 1  if not full and spare >= 1
    scope.store "headers", scope.headers

  scope.toggleKeys = ->
    if scope.rememberKeys
      scope.store "access", scope.access
      scope.store "secret", scope.secret
      s3hook.set scope.access, scope.secret
      console.log "set keys"
    else
      localStorage.removeItem "access"
      localStorage.removeItem "secret"
      s3hook.clear()
      console.log "clear keys"

  scope.setKeys = ->
    s3hook.set scope.access, scope.secret

  scope.setURL = ->
    scope.url = scope.endpoint + "/" + scope.path

  percent = (curr,total) ->
    Math.min(Math.round((curr/total)*100), 100)

  scope.send = ->
    scope.upProgress = 0
    scope.downProgress = 0
    scope.loading = true

    xhr = scope.xhr = new XMLHttpRequest()
    xhr.open scope.method, scope.url
    for i of scope.headers
      h = scope.headers[i]
      n = h.name
      v = h.value
      xhr.setRequestHeader n, v  if n and v

    xhr.onreadystatechange = ->
      switch xhr.readyState
        when 2 then scope.upProgress = 100
        when 4
          scope.downProgress = 100
          scope.responseCode = xhr.status
          scope.responseHeaders = xhr.getAllResponseHeaders()
          txt = xhr.responseText
          #only show first 10k
          txt = txt.substr(0,10e3)+"..." if txt.length > 10e3
          scope.responseText = txt
          done()

    if xhr.upload
      xhr.upload.onprogress = (e) ->
        scope.upProgress = percent e.loaded, e.total
        scope.$apply()

    xhr.onprogress = (e) ->
      scope.downProgress = percent e.loaded, e.total
      scope.$apply()

    xhr.onerror = ->
      done()

    done = ->
      scope.loading = false
      scope.xhr = null
      scope.$apply()

    #'bytes' will be an Uint8Array and 'body' will be a string
    xhr.send (if scope.fileBody then scope.bytes else scope.body)

  scope.abort = ->
    scope.xhr.abort() if scope.xhr

  $timeout ->
    if scope.hasLocalStorage
      rememberFields.forEach (f) ->
        #load existing
        item = localStorage.getItem(f)
        scope[f] = JSON.parse(item)  if item isnt null
        #watch changes
        scope.$watch f, (curr, prev) ->
          scope.store f, curr

    scope.setURL()

).directive "dropzone", ($rootScope) ->
  scope = $rootScope
  restrict: "C"
  link: (sc, elem, attr) ->
    dropper = elem[0]
    dropper.ondragover = ->
      scope.hover = true
      scope.$apply()
      false

    dropper.ondragend = ->
      scope.hover = false
      scope.$apply()
      false

    dropper.ondrop = (e) ->
      e.preventDefault()
      file = e.dataTransfer.files[0]
      scope.file = file
      scope.filePath = file.name
      reader = new FileReader()
      reader.onload = (event) ->
        scope.bytes = new Uint8Array(reader.result)

      reader.readAsArrayBuffer file
      scope.$apply()
      false
