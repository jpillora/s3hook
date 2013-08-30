ACCESS_KEY = 'accessKeyId'
SECRET_KEY = 'secretAccessKey'

xdomain
  slaves:
    "https://s3-ap-southeast-2.amazonaws.com":"/jpillora-aus/proxy.html"

window.CryptoJS = CryptoJS

AWS = window.AWS =
  config:
    update: (obj) ->
      for k,v of obj
        @[k] = v