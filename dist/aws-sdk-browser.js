// Unofficial AWS SDK for the Browser - v0.1.0 - https://github.com/jpillora/aws-sdk-browser
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2013
(function(window,document,undefined) {
;(function () {

  var
    object = typeof window != 'undefined' ? window : exports,
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    INVALID_CHARACTER_ERR = (function () {
      // fabricate a suitable error object
      try { document.createElement('$'); }
      catch (error) { return error; }}());

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
  object.btoa = function (input) {
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next input index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      input.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = input.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) throw INVALID_CHARACTER_ERR;
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    input = input.replace(/=+$/, '')
    if (input.length % 4 == 1) throw INVALID_CHARACTER_ERR;
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  });

}());
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(g,l){var e={},d=e.lib={},m=function(){},k=d.Base={extend:function(a){m.prototype=this;var c=new m;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
p=d.WordArray=k.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length},toString:function(a){return(a||n).stringify(this)},concat:function(a){var c=this.words,q=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var b=0;b<a;b++)c[f+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((f+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[f+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=g.ceil(c/4)},clone:function(){var a=k.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*g.random()|0);return new p.init(c,a)}}),b=e.enc={},n=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++){var d=c[f>>>2]>>>24-8*(f%4)&255;b.push((d>>>4).toString(16));b.push((d&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f+=2)b[f>>>3]|=parseInt(a.substr(f,
2),16)<<24-4*(f%8);return new p.init(b,c/2)}},j=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++)b.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f++)b[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new p.init(b,c)}},h=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)))}},
r=d.BufferedBlockAlgorithm=k.extend({reset:function(){this._data=new p.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,f=c.sigBytes,d=this.blockSize,e=f/(4*d),e=a?g.ceil(e):g.max((e|0)-this._minBufferSize,0);a=e*d;f=g.min(4*a,f);if(a){for(var k=0;k<a;k+=d)this._doProcessBlock(b,k);k=b.splice(0,a);c.sigBytes-=f}return new p.init(k,f)},clone:function(){var a=k.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});d.Hasher=r.extend({cfg:k.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){r.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,d){return(new a.init(d)).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return(new s.HMAC.init(a,
d)).finalize(b)}}});var s=e.algo={};return e}(Math);
(function(){var g=CryptoJS,l=g.lib,e=l.WordArray,d=l.Hasher,m=[],l=g.algo.SHA1=d.extend({_doReset:function(){this._hash=new e.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(d,e){for(var b=this._hash.words,n=b[0],j=b[1],h=b[2],g=b[3],l=b[4],a=0;80>a;a++){if(16>a)m[a]=d[e+a]|0;else{var c=m[a-3]^m[a-8]^m[a-14]^m[a-16];m[a]=c<<1|c>>>31}c=(n<<5|n>>>27)+l+m[a];c=20>a?c+((j&h|~j&g)+1518500249):40>a?c+((j^h^g)+1859775393):60>a?c+((j&h|j&g|h&g)-1894007588):c+((j^h^
g)-899497514);l=g;g=h;h=j<<30|j>>>2;j=n;n=c}b[0]=b[0]+n|0;b[1]=b[1]+j|0;b[2]=b[2]+h|0;b[3]=b[3]+g|0;b[4]=b[4]+l|0},_doFinalize:function(){var d=this._data,e=d.words,b=8*this._nDataBytes,g=8*d.sigBytes;e[g>>>5]|=128<<24-g%32;e[(g+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(g+64>>>9<<4)+15]=b;d.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=d.clone.call(this);e._hash=this._hash.clone();return e}});g.SHA1=d._createHelper(l);g.HmacSHA1=d._createHmacHelper(l)})();
(function(){var g=CryptoJS,l=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(e,d){e=this._hasher=new e.init;"string"==typeof d&&(d=l.parse(d));var g=e.blockSize,k=4*g;d.sigBytes>k&&(d=e.finalize(d));d.clamp();for(var p=this._oKey=d.clone(),b=this._iKey=d.clone(),n=p.words,j=b.words,h=0;h<g;h++)n[h]^=1549556828,j[h]^=909522486;p.sigBytes=b.sigBytes=k;this.reset()},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey)},update:function(e){this._hasher.update(e);return this},finalize:function(e){var d=
this._hasher;e=d.finalize(e);d.reset();return d.finalize(this._oKey.clone().concat(e))}})})();

// XDomain - v0.4.0 - https://github.com/jpillora/xdomain
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2013
(function(window,document,undefined) {
// XHook - v0.1.0 - https://github.com/jpillora/xhook
// Â© Jaime Pillora <dev@jpillora.com> 2013
(function(window,document,undefined) {
var EVENTS, FNS, PROPS, READY_STATE, RESPONSE_TEXT, WITH_CREDS, convertHeaders, create, patchClass, patchXhr, xhook,
  __slice = [].slice;

FNS = ["open", "setRequestHeader", "send", "abort", "getAllResponseHeaders", "getResponseHeader", "overrideMimeType"];

EVENTS = ["onreadystatechange", "onprogress", "onloadstart", "onloadend", "onload", "onerror", "onabort"];

PROPS = ["readyState", "responseText", "withCredentials", "statusText", "status", "response", "responseType", "responseXML", "upload"];

READY_STATE = PROPS[0];

RESPONSE_TEXT = PROPS[1];

WITH_CREDS = PROPS[2];

create = function(parent) {
  var F;
  F = function() {};
  F.prototype = parent;
  return new F;
};

xhook = function(callback) {
  return xhook.s.push(callback);
};

xhook.s = [];

convertHeaders = function(h, dest) {
  var header, headers, k, v, _i, _len;
  if (dest == null) {
    dest = {};
  }
  switch (typeof h) {
    case "object":
      headers = [];
      for (k in h) {
        v = h[k];
        headers.push("" + k + ":\t" + v);
      }
      return headers.join('\n');
    case "string":
      headers = h.split('\n');
      for (_i = 0, _len = headers.length; _i < _len; _i++) {
        header = headers[_i];
        if (/([^:]+):\s*(.+)/.test(header)) {
          if (!dest[RegExp.$1]) {
            dest[RegExp.$1] = RegExp.$2;
          }
        }
      }
      return dest;
  }
};

xhook.headers = convertHeaders;

xhook.PROPS = PROPS;

patchClass = function(name) {
  var Class;
  Class = window[name];
  if (!Class) {
    return;
  }
  return window[name] = function(arg) {
    if (typeof arg === "string" && !/\.XMLHTTP/.test(arg)) {
      return;
    }
    return patchXhr(new Class(arg), Class);
  };
};

patchClass("ActiveXObject");

patchClass("XMLHttpRequest");

patchXhr = function(xhr, Class) {
  var callback, cloneEvent, data, eventName, fn, hooked, requestHeaders, responseHeaders, setAllValues, setValue, user, userOnCalls, userOnChanges, userRequestHeaders, userResponseHeaders, userSets, x, xhrDup, _fn, _i, _j, _k, _len, _len1, _len2, _ref;
  if (xhook.s.length === 0) {
    return xhr;
  }
  hooked = false;
  xhrDup = {};
  x = {};
  x[WITH_CREDS] = false;
  requestHeaders = {};
  responseHeaders = {};
  data = {};
  cloneEvent = function(e) {
    var clone, key, val;
    clone = {};
    for (key in e) {
      val = e[key];
      clone[key] = val === xhr ? x : val;
    }
    return clone;
  };
  user = create(data);
  userSets = {};
  user.set = function(prop, val) {
    var _results;
    hooked = true;
    userSets[prop] = 1;
    if (prop === READY_STATE) {
      _results = [];
      while (x[READY_STATE] < val) {
        x[READY_STATE]++;
        if (x[READY_STATE] === xhr[READY_STATE]) {
          continue;
        }
        user.trigger('readystatechange');
        if (x[READY_STATE] === 1) {
          user.trigger('loadstart');
        }
        if (x[READY_STATE] === 4) {
          user.trigger('load');
          _results.push(user.trigger('loadend'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    } else {
      return x[prop] = val;
    }
  };
  userRequestHeaders = create(requestHeaders);
  user.setRequestHeader = function(key, val) {
    hooked = true;
    userRequestHeaders[key] = val;
    if (!data.opened) {
      return;
    }
    return xhr.setRequestHeader(key, val);
  };
  userResponseHeaders = create(responseHeaders);
  user.setResponseHeader = function(key, val) {
    hooked = true;
    return userResponseHeaders[key] = val;
  };
  userOnChanges = {};
  userOnCalls = {};
  user.onChange = function(event, callback) {
    hooked = true;
    return (userOnChanges[event] = userOnChanges[event] || []).push(callback);
  };
  user.onCall = function(event, callback) {
    hooked = true;
    return (userOnCalls[event] = userOnCalls[event] || []).push(callback);
  };
  user.trigger = function(event, obj) {
    var _ref;
    if (obj == null) {
      obj = {};
    }
    event = event.replace(/^on/, '');
    obj.type = event;
    return (_ref = x['on' + event]) != null ? _ref.call(x, obj) : void 0;
  };
  user.serialize = function() {
    var k, p, props, req, res, v, _i, _len;
    props = {};
    for (_i = 0, _len = PROPS.length; _i < _len; _i++) {
      p = PROPS[_i];
      props[p] = x[p];
    }
    res = {};
    for (k in userResponseHeaders) {
      v = userResponseHeaders[k];
      res[k] = v;
    }
    req = {};
    for (k in userRequestHeaders) {
      v = userRequestHeaders[k];
      req[k] = v;
    }
    return {
      method: data.method,
      url: data.url,
      async: data.async,
      body: data.body,
      responseHeaders: res,
      requestHeaders: req,
      props: props
    };
  };
  user.deserialize = function(obj) {
    var h, k, p, v, _i, _len, _ref, _ref1, _ref2, _ref3;
    _ref = ['method', 'url', 'async', 'body'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      if (obj[k]) {
        user[k] = obj[k];
      }
    }
    _ref1 = obj.responseHeaders || {};
    for (h in _ref1) {
      v = _ref1[h];
      user.setResponseHeader(h, v);
    }
    _ref2 = obj.requestHeaders || {};
    for (h in _ref2) {
      v = _ref2[h];
      user.setRequestHeader(h, v);
    }
    _ref3 = obj.props || {};
    for (p in _ref3) {
      v = _ref3[p];
      user.set(p, v);
    }
  };
  for (_i = 0, _len = FNS.length; _i < _len; _i++) {
    fn = FNS[_i];
    if (xhr[fn]) {
      (function(key) {
        return x[key] = function() {
          var args, callback, callbacks, newargs, result, _j, _len1;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          data.opened = !data.opened && key === 'open';
          data.sent = !data.sent && key === 'send';
          switch (key) {
            case "getAllResponseHeaders":
              return convertHeaders(userResponseHeaders);
            case "send":
              data.body = args[0];
              break;
            case "open":
              data.method = args[0];
              data.url = args[1];
              data.async = args[2];
          }
          newargs = args;
          callbacks = userOnCalls[key] || [];
          for (_j = 0, _len1 = callbacks.length; _j < _len1; _j++) {
            callback = callbacks[_j];
            result = callback(args);
            if (result === false) {
              return;
            }
            if (result) {
              newargs = result;
            }
          }
          if (key === "setRequestHeader") {
            requestHeaders[newargs[0]] = newargs[1];
            if (userRequestHeaders[args[0]] !== undefined) {
              return;
            }
          }
          if (xhr[key]) {
            return xhr[key].apply(xhr, newargs);
          }
        };
      })(fn);
    }
  }
  setAllValues = function() {
    var err, prop, _j, _len1, _results;
    try {
      _results = [];
      for (_j = 0, _len1 = PROPS.length; _j < _len1; _j++) {
        prop = PROPS[_j];
        _results.push(setValue(prop, xhr[prop]));
      }
      return _results;
    } catch (_error) {
      err = _error;
      if (err.constructor.name === 'TypeError') {
        throw err;
      }
    }
  };
  setValue = function(prop, curr) {
    var callback, callbacks, key, override, prev, result, val, _j, _len1;
    prev = xhrDup[prop];
    if (curr === prev) {
      return;
    }
    xhrDup[prop] = curr;
    if (prop === READY_STATE) {
      if (curr === 1) {
        for (key in userRequestHeaders) {
          val = userRequestHeaders[key];
          xhr.setRequestHeader(key, val);
        }
      }
      if (curr === 2) {
        data.statusCode = xhr.status;
        convertHeaders(xhr.getAllResponseHeaders(), responseHeaders);
      }
    }
    callbacks = userOnChanges[prop] || [];
    for (_j = 0, _len1 = callbacks.length; _j < _len1; _j++) {
      callback = callbacks[_j];
      result = callback(curr, prev);
      if (result !== undefined) {
        override = result;
      }
    }
    if (userSets[prop]) {
      return;
    }
    return x[prop] = override === undefined ? curr : override;
  };
  _fn = function(eventName) {
    return xhr[eventName] = function(event) {
      var copy;
      setAllValues();
      if (event) {
        copy = cloneEvent(event);
      }
      (window.E = window.E || []).push(copy);
      if (x[eventName]) {
        return x[eventName].call(x, copy);
      }
    };
  };
  for (_j = 0, _len1 = EVENTS.length; _j < _len1; _j++) {
    eventName = EVENTS[_j];
    _fn(eventName);
  }
  setAllValues();
  _ref = xhook.s;
  for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
    callback = _ref[_k];
    callback.call(null, user);
  }
  if (hooked) {
    return x;
  } else {
    return xhr;
  }
};

window.xhook = xhook;
}(window,document));
'use strict';
var Frame, PING, currentOrigin, feature, getMessage, guid, masters, onMessage, p, parseUrl, script, setMessage, setupMaster, setupSlave, slaves, toRegExp, warn, _i, _j, _len, _len1, _ref, _ref1;

currentOrigin = location.protocol + '//' + location.host;

warn = function(str) {
  str = "xdomain (" + currentOrigin + "): " + str;
  if (console['warn']) {
    return console.warn(str);
  } else {
    return alert(str);
  }
};

_ref = ['postMessage', 'JSON'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  feature = _ref[_i];
  if (!window[feature]) {
    warn("requires '" + feature + "' and this browser does not support it");
    return;
  }
}

PING = 'XPING';

guid = function() {
  return (Math.random() * Math.pow(2, 32)).toString(16);
};

parseUrl = function(url) {
  if (/(https?:\/\/[^\/]+)(\/.*)?/.test(url)) {
    return {
      origin: RegExp.$1,
      path: RegExp.$2
    };
  } else {
    return null;
  }
};

toRegExp = function(obj) {
  var str;
  if (obj instanceof RegExp) {
    return obj;
  }
  str = obj.toString().replace(/\W/g, function(str) {
    return "\\" + str;
  }).replace(/\\\*/g, ".+");
  return new RegExp("^" + str + "$");
};

onMessage = function(fn) {
  if (document.addEventListener) {
    return window.addEventListener("message", fn);
  } else {
    return window.attachEvent("onmessage", fn);
  }
};

setMessage = function(obj) {
  return JSON.stringify(obj);
};

getMessage = function(str) {
  return JSON.parse(str);
};

setupSlave = function(masters) {
  onMessage(function(event) {
    var frame, k, master, masterRegex, message, origin, p, pathRegex, proxyXhr, regex, req, v, _ref1;
    origin = event.origin;
    pathRegex = null;
    for (master in masters) {
      regex = masters[master];
      try {
        masterRegex = toRegExp(master);
        if (masterRegex.test(origin)) {
          pathRegex = toRegExp(regex);
          break;
        }
      } catch (_error) {}
    }
    if (!pathRegex) {
      warn("blocked request from: '" + origin + "'");
      return;
    }
    frame = event.source;
    message = getMessage(event.data);
    req = message.req;
    p = parseUrl(req.url);
    if (!(p && pathRegex.test(p.path))) {
      warn("blocked request to path: '" + p.path + "' by regex: " + regex);
      return;
    }
    proxyXhr = new XMLHttpRequest();
    proxyXhr.open(req.method, req.url);
    proxyXhr.onreadystatechange = function() {
      var m, res, _j, _ref1;
      if (proxyXhr.readyState !== 4) {
        return;
      }
      res = {
        props: {}
      };
      _ref1 = xhook.PROPS;
      for (_j = _ref1.length - 1; _j >= 0; _j += -1) {
        p = _ref1[_j];
        if (p !== 'responseXML') {
          res.props[p] = proxyXhr[p];
        }
      }
      res.responseHeaders = xhook.headers(proxyXhr.getAllResponseHeaders());
      m = setMessage({
        id: message.id,
        res: res
      });
      return frame.postMessage(m, origin);
    };
    _ref1 = req.requestHeaders;
    for (k in _ref1) {
      v = _ref1[k];
      proxyXhr.setRequestHeader(k, v);
    }
    return proxyXhr.send();
  });
  if (window === window.parent) {
    return warn("slaves must be in an iframe");
  } else {
    return window.parent.postMessage(PING, '*');
  }
};

setupMaster = function(slaves) {
  onMessage(function(e) {
    var _ref1;
    return (_ref1 = Frame.prototype.frames[e.origin]) != null ? _ref1.recieve(e) : void 0;
  });
  return xhook(function(xhr) {
    xhr.onCall('open', function(args) {
      var p;
      p = parseUrl(args[1]);
      if (!(p && slaves[p.origin])) {
        return;
      }
      if (args[2] === false) {
        warn("sync not supported");
      }
      setTimeout(function() {
        return xhr.set('readyState', 1);
      });
      return false;
    });
    return xhr.onCall('send', function() {
      var frame, p;
      p = parseUrl(xhr.url);
      if (!(p && slaves[p.origin])) {
        return;
      }
      frame = new Frame(p.origin, slaves[p.origin]);
      frame.send(xhr.serialize(), function(res) {
        return xhr.deserialize(res);
      });
      return false;
    });
  });
};

Frame = (function() {
  Frame.prototype.frames = {};

  function Frame(origin, proxyPath) {
    this.origin = origin;
    this.proxyPath = proxyPath;
    if (this.frames[this.origin]) {
      return this.frames[this.origin];
    }
    this.frames[this.origin] = this;
    this.listeners = {};
    this.frame = document.createElement("iframe");
    this.frame.id = this.frame.name = 'xdomain-' + guid();
    this.frame.src = this.origin + this.proxyPath;
    this.frame.setAttribute('style', 'display:none;');
    document.body.appendChild(this.frame);
    this.waits = 0;
    this.ready = false;
  }

  Frame.prototype.post = function(msg) {
    return this.frame.contentWindow.postMessage(msg, this.origin);
  };

  Frame.prototype.listen = function(id, callback) {
    if (this.listeners[id]) {
      throw "already listening for: " + id;
    }
    return this.listeners[id] = callback;
  };

  Frame.prototype.unlisten = function(id) {
    return delete this.listeners[id];
  };

  Frame.prototype.recieve = function(event) {
    var cb, message;
    if (event.data === PING) {
      this.ready = true;
      return;
    }
    message = getMessage(event.data);
    cb = this.listeners[message.id];
    if (!cb) {
      warn("unkown message (" + message.id + ")");
      return;
    }
    this.unlisten(message.id);
    return cb(message.res);
  };

  Frame.prototype.send = function(req, callback) {
    var _this = this;
    return this.readyCheck(function() {
      var id;
      id = guid();
      _this.listen(id, function(data) {
        return callback(data);
      });
      return _this.post(setMessage({
        id: id,
        req: req
      }));
    });
  };

  Frame.prototype.readyCheck = function(callback) {
    var _this = this;
    if (this.ready === true) {
      return callback();
    }
    if (this.waits++ >= 100) {
      throw "Timeout connecting to iframe: " + this.origin;
    }
    return setTimeout(function() {
      return _this.readyCheck(callback);
    }, 100);
  };

  return Frame;

})();

window.xdomain = function(o) {
  if (!o) {
    return;
  }
  if (o.masters) {
    setupSlave(o.masters);
  }
  if (o.slaves) {
    return setupMaster(o.slaves);
  }
};

xdomain.origin = currentOrigin;

_ref1 = document.getElementsByTagName("script");
for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
  script = _ref1[_j];
  if (/xdomain/.test(script.src)) {
    if (script.hasAttribute('slave')) {
      p = parseUrl(script.getAttribute('slave'));
      if (!p) {
        return;
      }
      slaves = {};
      slaves[p.origin] = p.path;
      xdomain({
        slaves: slaves
      });
    }
    if (script.hasAttribute('master')) {
      masters = {};
      masters[script.getAttribute('master')] = /./;
      xdomain({
        masters: masters
      });
    }
  }
}
}(window,document));
var ACCESS_KEY, AWS, S3, SECRET_KEY, ajax, baseUrl;

ACCESS_KEY = 'accessKeyId';

SECRET_KEY = 'secretAccessKey';

xdomain({
  slaves: {
    "https://s3-ap-southeast-2.amazonaws.com": "/jpillora-aus/proxy.html"
  }
});

window.CryptoJS = CryptoJS;

AWS = window.AWS = {
  config: {
    update: function(obj) {
      var k, v, _results;
      _results = [];
      for (k in obj) {
        v = obj[k];
        _results.push(this[k] = v);
      }
      return _results;
    }
  }
};

baseUrl = "https://s3-ap-southeast-2.amazonaws.com/jpillora-aus/";

S3 = (function() {
  function S3(obj) {}

  S3.prototype.getObject = function(key, callback) {
    return ajax({
      method: "GET",
      url: "" + baseUrl + key
    }, callback);
  };

  S3.prototype.putObject = function(key, val, callback) {
    return ajax({
      method: "PUT",
      url: "" + baseUrl + key,
      data: val
    }, callback);
  };

  return S3;

})();

AWS.S3 = S3;

ajax = window.ajax = function(opts, callback) {
  var Authorization, done, message, sig, xhr;
  message = "GET\n" + "\n" + "\n" + "Tue, 27 Mar 2007 19:36:42 +0000\n" + "/johnsmith/photos/puppy.jpg";
  sig = window.btoa(CryptoJS.HmacSHA1(message, AWS.config[SECRET_KEY]));
  Authorization = "AWS " + AWS.config[ACCESS_KEY] + ":" + sig;
  console.log("Authorization: " + Authorization);
  console.log("Authorization: AWS AKIAIOSFODNN7EXAMPLE:bWq2s1WEIj+Ydj0vQ697zp+IXMU=");
  xhr = new XMLHttpRequest();
  xhr.open(opts.method || 'GET', opts.url || '');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      return done();
    }
  };
  done = function() {
    return callback({
      status: xhr.status,
      responseText: xhr.responseText
    });
  };
  return xhr.send(opts.data);
};
}(window,document));