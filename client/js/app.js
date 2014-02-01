(function() {
  xdomain.debug = false;

  angular.module("s3-demo", []).run(function($rootScope, $timeout, $http) {
    var percent, rememberFields, scope;
    scope = window.root = $rootScope;
    scope.hasLocalStorage = !!window.localStorage;
    scope.running = false;
    scope.fileBody = true;
    scope.rememberKeys = true;
    scope.endpoints = s3hook.endpoints();
    scope.headers = [
      {
        name: 'x-amz-acl',
        value: 'public-read'
      }
    ];
    scope.methods = ["GET", "PUT", "POST", "DELETE"];
    scope.method = scope.methods[0];
    scope.endpoint = scope.endpoints[0];
    rememberFields = ["headers", "access", "secret", "rememberKeys", "method", "endpoint", "body", "path", "fileBody"];
    scope.loading = false;
    scope.store = function(key, value) {
      if (!scope.hasLocalStorage) {
        return;
      }
      if (key === "access" || key === "secret") {
        s3hook.set(scope.access, scope.secret);
        if (!scope.rememberKeys) {
          return;
        }
      }
      if (value === undefined) {
        return localStorage.removeItem(key);
      } else {
        return localStorage.setItem(key, JSON.stringify(value));
      }
    };
    scope.updateHeaders = function() {
      var full, h, i, spare;
      spare = -1;
      full = true;
      for (i in scope.headers) {
        h = scope.headers[i];
        if (!h.name || !h.value) {
          if (!full) {
            spare = +i;
          }
          full = false;
        }
      }
      if (full) {
        scope.headers.push({});
      } else {
        if (!full && spare >= 1) {
          scope.headers.splice(spare, 1);
        }
      }
      return scope.store("headers", scope.headers);
    };
    scope.toggleKeys = function() {
      if (scope.rememberKeys) {
        scope.store("access", scope.access);
        scope.store("secret", scope.secret);
        s3hook.set(scope.access, scope.secret);
        return console.log("set keys");
      } else {
        localStorage.removeItem("access");
        localStorage.removeItem("secret");
        s3hook.clear();
        return console.log("clear keys");
      }
    };
    scope.setKeys = function() {
      return s3hook.set(scope.access, scope.secret);
    };
    scope.setURL = function() {
      return scope.url = scope.endpoint + "/" + scope.path;
    };
    percent = function(curr, total) {
      return Math.min(Math.round((curr / total) * 100), 100);
    };
    scope.send = function() {
      var done, h, i, n, v, xhr;
      scope.upProgress = 0;
      scope.downProgress = 0;
      scope.loading = true;
      xhr = scope.xhr = new XMLHttpRequest();
      xhr.open(scope.method, scope.url);
      for (i in scope.headers) {
        h = scope.headers[i];
        n = h.name;
        v = h.value;
        if (n && v) {
          xhr.setRequestHeader(n, v);
        }
      }
      xhr.onreadystatechange = function() {
        var txt;
        switch (xhr.readyState) {
          case 2:
            return scope.upProgress = 100;
          case 4:
            scope.downProgress = 100;
            scope.responseCode = xhr.status;
            scope.responseHeaders = xhr.getAllResponseHeaders();
            txt = xhr.responseText;
            if (txt.length > 10e3) {
              txt = txt.substr(0, 10e3) + "...";
            }
            scope.responseText = txt;
            return done();
        }
      };
      if (xhr.upload) {
        xhr.upload.onprogress = function(e) {
          scope.upProgress = percent(e.loaded, e.total);
          return scope.$apply();
        };
      }
      xhr.onprogress = function(e) {
        scope.downProgress = percent(e.loaded, e.total);
        return scope.$apply();
      };
      xhr.onerror = function() {
        return done();
      };
      done = function() {
        scope.loading = false;
        scope.xhr = null;
        return scope.$apply();
      };
      return xhr.send((scope.fileBody ? scope.bytes : scope.body));
    };
    scope.abort = function() {
      if (scope.xhr) {
        return scope.xhr.abort();
      }
    };
    return $timeout(function() {
      if (scope.hasLocalStorage) {
        rememberFields.forEach(function(f) {
          var item;
          item = localStorage.getItem(f);
          if (item !== null) {
            scope[f] = JSON.parse(item);
          }
          return scope.$watch(f, function(curr, prev) {
            return scope.store(f, curr);
          });
        });
      }
      return scope.setURL();
    });
  }).directive("dropzone", function($rootScope) {
    var scope;
    scope = $rootScope;
    return {
      restrict: "C",
      link: function(sc, elem, attr) {
        var dropper;
        dropper = elem[0];
        dropper.ondragover = function() {
          scope.hover = true;
          scope.$apply();
          return false;
        };
        dropper.ondragend = function() {
          scope.hover = false;
          scope.$apply();
          return false;
        };
        return dropper.ondrop = function(e) {
          var file, reader;
          e.preventDefault();
          file = e.dataTransfer.files[0];
          scope.file = file;
          scope.filePath = file.name;
          reader = new FileReader();
          reader.onload = function(event) {
            return scope.bytes = new Uint8Array(reader.result);
          };
          reader.readAsArrayBuffer(file);
          scope.$apply();
          return false;
        };
      }
    };
  });

}).call(this);
