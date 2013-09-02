# S3.js

A Serverless Client for AWS Simple Storage Service

## *Disclaimer*

As this library self signs its own requests, it requires the access key
**and the secret key**. For this reason, it should only be used for internal
applications where the keys are only provided to trusted users. In addition,
the key set should **only** have access to a particular
bucket and to a particular prefix.

## Example

``` js
S3.set({
  accessKeyId: '...',
  secretAccessKey: '...'
});

var endpoint = 'https://s3-ap-southeast-2.amazonaws.com';
var bucket = 'jpillora-aus';
var key = 'restricted/secret.txt';
var url = [endpoint,bucket,key].join('/');

S3.getObject(url, function(data) {
  console.log(data.responseText)
});
```

## Live demo

### http://jpillora.com/s3js/

## Download

* Development [s3.js](http://jpillora.com/s3js/dist/s3.js) 36KB
* Production [s3.min.js](http://jpillora.com/s3js/dist/s3.min.js) 16KB (4.7KB Gzip)

## API

### `S3.set(object)`

Set S3 configuration

* v`object.accessKeyId` - AWS Access Key
* `object.secretAccessKey` - AWS Secret Key

### `S3.getObject(url, callback(result))`

Gets an object

* `url` - The object URI (includes endpoint, bucket and key)
* `result` - See below

### `S3.putObject(url, data, callback(result))`

* `url` - The object URI (includes endpoint, bucket and key)
* `data` - The object data
* `result` - See below

#### `result`

The response object

* `result.status` - Status code number
* `result.responseText` - Response body
* `result.responseHeaders` - Response headers
* `result.requestHeaders` - Request headers

## References

http://docs.aws.amazon.com/AmazonS3/latest/dev/MakingRequests.html

http://docs.aws.amazon.com/AmazonS3/latest/dev/RESTAuthentication.html

#### MIT License

Copyright © 2013 Jaime Pillora &lt;dev@jpillora.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

