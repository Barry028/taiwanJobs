// Ajax數據請求
;
(function(TurboFrame) {
  var doc = window.doc,
    key, name, scriptTypeRE = /^(?:text|application)\/javascript/i,
    xmlTypeRE = /^(?:text|application)\/xml/i,
    jsonType = "application/json",
    htmlType = "text/html";
  TurboFrame.extend({
    ajaxConfig: {
      type: "GET",
      data: "",
      dataType: "json",
      jsonp: "callback",
      async: true,
      contentType: "",
      beforeSend: TurboFrame.noop,
      success: TurboFrame.noop,
      error: TurboFrame.noop,
      complete: TurboFrame.noop,
      context: null,
      global: true,
      cache: true,
      crossDomain: false,
      timeout: 0,
      accepts: {
        script: "text/javascript, application/javascript",
        json: jsonType,
        xml: "application/xml, text/xml",
        html: htmlType,
        text: "text/plain"
      }
    },
    get: function(url, success) {
      TurboFrame.ajax({
        url: url,
        success: success
      });
    },
    post: function(url, data, success, dataType) {
      if (typeof data === "function") dataType = dataType || success, success = data,
        data = null;
      TurboFrame.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,
        dataType: dataType
      });
    },
    getJSON: function(url, success) {
      TurboFrame.ajax({
        url: url,
        success: success,
        dataType: "json"
      });
    },
    ajax: function(options) {
      var jsonpID = 0,
        timestamp = new Date() * 1,
        active = 0,
        typeTouper, opts = typeof options === "object" ? options : {};
      for (i in TurboFrame.ajaxConfig)
        if (typeof opts[i] === "undefined") opts[i] = TurboFrame.ajaxConfig[i];
      typeTouper = opts.type.toUpperCase();
      var xhrAjax = {
        xhr: function() {
          var xmlhttp = null;
          // 針對不同瀏覽器建立這個對象的不同方式寫不同代碼
          if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
            //針對某些特定版本的Mozillar瀏覽器的BUG進行修正
            if (xmlhttp.overrideMimeType) xmlhttp.overrideMimeType("text/xml");
          } else if (window.ActiveXObject) {
            var activexName = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
            for (var i = 0; i < activexName.length; i++) {
              try {
                xmlhttp = new ActiveXObject(activexName[i]);
                break;
              } catch (e) {}
            }
          }
          return xmlhttp;
        },
        buildParams: function(obj) {
          var i, j, k, len, arr = [];
          if (typeof obj === "string") {
            return obj;
          } else if (typeof obj === "object") {
            for (i in obj) {
              // 處理數組 {arr:[1, 2, 3]} => arr[]=1&arr[]=2&arr[]=3
              if (TurboFrame.isArray(obj[i])) {
                k = i + i.substr(-2, 2) === "[]" ? "" : "[]";
                for (j = 0, len = obj[i].length; j < len; j++) {
                  arr.push(k + "=" + encodeURIComponent(obj[i][j] + ""));
                }
              } else {
                arr.push(i + "=" + encodeURIComponent(obj[i] + ""));
              }
            }
          }
          return arr.join("&");
        },
        ajaxJSONP: function() {
          var done, callbackName = "jsonp" + ++jsonpID,
            xmlHttp = xhrAjax.xhr(),
            done = false;
          if (xhrAjax.ajaxBeforeSend(xmlHttp) !== false) {
            var script = doc.createElement("script"),
              abort = function() {
                if (callbackName in window) window[callbackName] = TurboFrame.noop;
                xhrAjax.ajaxComplete("abort", xmlHttp);
              },
              xmlHttp = {
                abort: abort
              },
              abortTimeout;
            if (opts.error) script.onerror = function() {
              xmlHttp.abort();
              opts.error();
            };
            window[callbackName] = function(data) {
              clearTimeout(abortTimeout);
              window[callbackName] = null;
              xhrAjax.ajaxSuccess(data, xmlHttp);
            };
            xhrAjax.serializeData();
            script.src = opts.url.replace(/=\?/, "=" + callbackName);
            script.onload = script.onreadystatechange = function() {
              if (!done && (!script.readyState || script.readyState === "loaded" || script.readyState === "complete")) {
                done = true;
                script.onload = script.onreadystatechange = null;
                if (script && script.parentNode) {
                  TurboFrame(script).remove();
                }
                return script = null;
              }
            };
            head = doc.getElementsByTagName("head")[0] || doc.documentElement;
            head.appendChild(script);
            if (opts.timeout > 0) abortTimeout = setTimeout(function() {
              xmlHttp.abort();
              xhrAjax.ajaxComplete("timeout", xmlHttp, opts);
            }, opts.timeout);
          }
        },
        // trigger an Ajax "global" event
        triggerGlobal: function(context, eventName, data) {
          if (opts.global) return true;
        },
        ajaxStart: function() {
          if (opts.global && active++ === 0) xhrAjax.triggerGlobal(null, "ajaxStart");
        },
        ajaxStop: function() {
          if (opts.global && !--active) xhrAjax.triggerGlobal(null, "ajaxStop");
        },
        // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
        ajaxBeforeSend: function(xhr) {
          var context = opts.context;
          if (opts.beforeSend.call(context, xhr, opts) === false || xhrAjax.triggerGlobal(opts, context, "ajaxBeforeSend", [xhr, opts]) === false) return false;
          xhrAjax.triggerGlobal(opts, context, "ajaxSend", [xhr, opts]);
        },
        ajaxSuccess: function(data, xhr) {
          var context = opts.context,
            status = "success";
          opts.success.call(context, data, status, xhr);
          xhrAjax.triggerGlobal(context, "ajaxSuccess", [xhr, opts, data]);
          xhrAjax.ajaxComplete(status, xhr);
        },
        // type: "timeout", "error", "abort", "parsererror"
        ajaxError: function(error, type, xhr) {
          var context = opts.context;
          opts.error.call(context, xhr, type, error);
          xhrAjax.triggerGlobal(context, "ajaxError", [xhr, opts, error]);
          xhrAjax.ajaxComplete(type, xhr);
        },
        // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
        ajaxComplete: function(status, xhr) {
          var context = opts.context;
          opts.complete.call(context, xhr, status);
          xhrAjax.triggerGlobal(opts, context, "ajaxComplete", [xhr, opts]);
          xhrAjax.ajaxStop();
        },
        mimeToDataType: function(mime) {
          return mime && (mime == htmlType ? "html" : mime == jsonType ? "json" : scriptTypeRE.test(mime) ? "script" : xmlTypeRE.test(mime) && "xml") || "text";
        },
        serializeData: function() {
          var appendQuery = function(url, query) {
            var cachestamp = opts.cache ? "&_jexhr_=" + timestamp : "",
              dataType = opts.dataType == "jsonp" ? "&" + opts.jsonp + "=?" : "";
            return (url += (/\?/.test(url) ? "&" : "?") + query + dataType + cachestamp).replace(/[&?]{1,2}/, "?");
          };
          if (typeof opts.data === "object") opts.data = xhrAjax.buildParams(opts.data);
          if (opts.data && (!opts.type || opts.type.toUpperCase() == "GET")) opts.url = appendQuery(opts.url, opts.data);
        }
      };
      xhrAjax.ajaxStart();
      if (!opts.crossDomain) opts.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(opts.url) && RegExp.$2 != window.location.host;
      var dataType = opts.dataType,
        hasPlaceholder = /=\?/.test(opts.url);
      if (dataType == "jsonp" || hasPlaceholder) return xhrAjax.ajaxJSONP();
      if (!opts.url) opts.url = window.location.toString();
      xhrAjax.serializeData();
      var mime = opts.accepts[dataType],
        baseHeaders = {},
        protocol = /^([\w-]+:)\/\//.test(opts.url) ? RegExp.$1 : window.location.protocol,
        xmlHttp = xhrAjax.xhr(),
        abortTimeout;
      if (!opts.crossDomain) baseHeaders["X-Requested-With"] = "XMLHttpRequest";
      if (mime) {
        baseHeaders["Accept"] = mime;
        if (mime.indexOf(",") > -1) mime = mime.split(",", 2)[0];
        xmlHttp.overrideMimeType && xmlHttp.overrideMimeType(mime);
      }
      if (opts.contentType || opts.data && typeTouper != "GET") {
        baseHeaders["Content-Type"] = opts.contentType || "application/x-www-form-urlencoded";
      } else {
        baseHeaders["Access-Control-Allow-Origin"] = opts.contentType || "application/json" || "*/*";
      }
      opts.headers = TurboFrame.extend(baseHeaders, opts.headers || {});
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
          clearTimeout(abortTimeout);
          var result, error = false;
          if (xmlHttp.status >= 200 && xmlHttp.status < 300 || xmlHttp.status == 304 || xmlHttp.status == 0 && protocol == "file:") {
            if (mime == "application/json" && !/^\s*$/.test(xmlHttp.responseText)) {
              dataType = dataType || xhrAjax.mimeToDataType(xmlHttp.getResponseHeader("content-type"));
              result = xmlHttp.responseText;
              try {
                if (dataType == "script") {
                  (1, eval)(result);
                } else if (dataType == "xml") {
                  result = xmlHttp.responseXML;
                } else if (dataType == "json") {
                  result = TurboFrame.parseJSON(result);
                }
              } catch (e) {
                error = e;
              }
              error ? xhrAjax.ajaxError(error, "parsererror", xmlHttp, opts) : xhrAjax.ajaxSuccess(result, xmlHttp, opts);
            } else {
              xhrAjax.ajaxSuccess(xmlHttp.responseText, xmlHttp, opts);
            }
          } else {
            xhrAjax.ajaxError(null, "error", xmlHttp, opts);
          }
        }
      };
      xmlHttp.open(typeTouper, opts.url, opts.async);
      for (name in opts.headers) xmlHttp.setRequestHeader(name, opts.headers[name]);
      if (xhrAjax.ajaxBeforeSend(xmlHttp, opts) === false) {
        xmlHttp.abort();
        return false;
      }
      if (opts.timeout > 0) abortTimeout = setTimeout(function() {
        xmlHttp.onreadystatechange = TurboFrame.noop;
        xmlHttp.abort();
        xhrAjax.ajaxError(null, "timeout", xmlHttp, opts);
      }, opts.timeout);
      var paramsData = opts.data ? xhrAjax.buildParams(opts.data) : null;
      xmlHttp.send(paramsData);
      return xmlHttp;
    }
  });
})(window.TurboFrame);