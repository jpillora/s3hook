




# Signature = Base64( HMAC-SHA1( YourSecretAccessKeyID, UTF-8-Encoding-Of( StringToSign ) ) );

# StringToSign = HTTP-Verb + "\n" +
#   Content-MD5 + "\n" +
#   Content-Type + "\n" +
#   Date + "\n" +
#   CanonicalizedAmzHeaders +
#   CanonicalizedResource;

# CanonicalizedResource = [ "/" + Bucket ] +
#   <HTTP-Request-URI, from the protocol name up to the query string> +
#   [ subresource, if present. For example "?acl", "?location", "?logging", or "?torrent"];

# CanonicalizedAmzHeaders = <described below>


ajax = window.ajax = (opts, callback) ->

  # message = "#{opts.method}\n" + 
  #           "\n"
  #           "\n"
  #           "#{new Date().toUTCString()}\n"
  #           "/bucket/path/to/file.txt"
  message = "GET\n" + 
            "\n" +
            "\n" +
            "Tue, 27 Mar 2007 19:36:42 +0000\n" +
            "/johnsmith/photos/puppy.jpg"

  sig = window.btoa(CryptoJS.HmacSHA1(message, AWS.config[SECRET_KEY]))

  Authorization = "AWS #{AWS.config[ACCESS_KEY]}:#{sig}"

  console.log "Authorization: #{Authorization}"
  console.log "Authorization: AWS AKIAIOSFODNN7EXAMPLE:bWq2s1WEIj+Ydj0vQ697zp+IXMU="

  xhr = new XMLHttpRequest()

  xhr.open opts.method or 'GET', opts.url or ''

  xhr.onreadystatechange = ->
    if xhr.readyState is 4
      done()

  done = ->
    callback {
      status: xhr.status
      responseText: xhr.responseText
    }

  xhr.send opts.data
