
baseUrl = "https://s3-ap-southeast-2.amazonaws.com/jpillora-aus/"

class S3
  constructor: (obj) ->

  getObject: (key, callback) ->
    ajax({
      method: "GET"
      url: "#{baseUrl}#{key}"
    }, callback)

  putObject: (key, val, callback) ->
    ajax({
      method: "PUT"
      url: "#{baseUrl}#{key}"
      data: val
    }, callback) 

AWS.S3 = S3

