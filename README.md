# S3 Hook

Transparent (via [XHook](https://github.com/jpillora/xhook)), Cross-domain (via [XDomain](https://github.com/jpillora/xdomain)), Client-side S3 Request Signing

All requests sent to `s3.amazonaws.com` are modified to include the correct `Authorization` header for the given credentials. `s3-ap-southeast-2.amazonaws.com` is also supported. To use other S3 endpoints or custom domains, see API for usage of the [proxy](#s3hookproxyurl) function.

### *Disclaimer*

As this library self signs its own requests, it requires the access key
**and the secret key**. For this reason, it should only be used for internal
applications where the keys are only provided to trusted users, or in cases
where a key is provided by the client and never sent to the server. In addition,
the key set should **only** have access to a particular
bucket and to a particular prefix.

## Example

``` js
//enable hook
s3hook.set("AKIAIOSFODNN7EXAMPLE","k3nL7gH3+PadhTEVn5EXAMPLE");

//choose your favourite XHR library, jQuery for example...
//then just use the AWS REST API...

//get bucket object list
$.get('https://s3.amazonaws.com/jpillora-usa/')

//put an object
$.ajax({type:'PUT', url:'https://s3.amazonaws.com/jpillora-usa/foo.txt', data:'hello world!' });
```

*Tip: Set the `x-amz-acl: public-read` header to make an object public*

## Demo

### [Serverless S3 Client - http://jpillora.com/s3hook/](http://jpillora.com/s3hook/)

## Download

* Development [s3hook.js](http://jpillora.com/s3hook/dist/0.2/s3hook.js) 36KB
* Production [s3hook.min.js](http://jpillora.com/s3hook/dist/0.2/s3hook.js) 16KB (5KB Gzip)

## API

### `s3hook`.`set(access, secret)`

Enable S3 Hook with the provided credentials

### `s3hook`.`clear()`

Disable S3 Hook and clear credentials

### `s3hook`.`xml2json`

Default `true`

Convert all XML responses (`*/xml`) to JSON (`application/json`)

### `s3hook`.`proxy(url)`

Add a new [XDomain](https://github.com/jpillora/xdomain) slave by providing a URL to a `proxy.html` file

S3 Hook is initialised with:

* `https://s3.amazonaws.com/jpillora-usa/xdomain/proxy.html`
* `https://s3-ap-southeast-2.amazonaws.com/jpillora-aus/xdomain/proxy.html`

## References

http://docs.aws.amazon.com/AmazonS3/latest/API/APIRest.html

http://docs.aws.amazon.com/AmazonS3/latest/dev/MakingRequests.html

http://docs.aws.amazon.com/AmazonS3/latest/dev/RESTAuthentication.html

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Todo

* Create a better S3 client than the AWS Console

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

