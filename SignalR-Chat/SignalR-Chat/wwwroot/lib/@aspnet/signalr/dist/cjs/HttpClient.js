"use strict";
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Errors_1 = require("./Errors");
var ILogger_1 = require("./ILogger");
/** Represents an HTTP response. */
var HttpResponse = /** @class */ (function () {
    function HttpResponse(statusCode, statusText, content) {
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.content = content;
    }
    return HttpResponse;
}());
exports.HttpResponse = HttpResponse;
/** Abstraction over an HTTP client.
 *
 * This class provides an abstraction over an HTTP client so that a different implementation can be provided on different platforms.
 */
var HttpClient = /** @class */ (function () {
    function HttpClient() {
    }
    HttpClient.prototype.get = function (url, options) {
        return this.send(tslib_1.__assign({}, options, { method: "GET", url: url }));
    };
    HttpClient.prototype.post = function (url, options) {
        return this.send(tslib_1.__assign({}, options, { method: "POST", url: url }));
    };
    HttpClient.prototype.delete = function (url, options) {
        return this.send(tslib_1.__assign({}, options, { method: "DELETE", url: url }));
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;
/** Default implementation of {@link HttpClient}. */
var DefaultHttpClient = /** @class */ (function (_super) {
    tslib_1.__extends(DefaultHttpClient, _super);
    /** Creates a new instance of the {@link DefaultHttpClient}, using the provided {@link ILogger} to log messages. */
    function DefaultHttpClient(logger) {
        var _this = _super.call(this) || this;
        _this.logger = logger;
        return _this;
    }
    /** @inheritDoc */
    DefaultHttpClient.prototype.send = function (request) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(request.method, request.url, true);
            xhr.withCredentials = true;
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            if (request.headers) {
                Object.keys(request.headers)
                    .forEach(function (header) { return xhr.setRequestHeader(header, request.headers[header]); });
            }
            if (request.responseType) {
                xhr.responseType = request.responseType;
            }
            if (request.abortSignal) {
                request.abortSignal.onabort = function () {
                    xhr.abort();
                };
            }
            if (request.timeout) {
                xhr.timeout = request.timeout;
            }
            xhr.onload = function () {
                if (request.abortSignal) {
                    request.abortSignal.onabort = null;
                }
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(new HttpResponse(xhr.status, xhr.statusText, xhr.response || xhr.responseText));
                }
                else {
                    reject(new Errors_1.HttpError(xhr.statusText, xhr.status));
                }
            };
            xhr.onerror = function () {
                _this.logger.log(ILogger_1.LogLevel.Warning, "Error from HTTP request. " + xhr.status + ": " + xhr.statusText);
                reject(new Errors_1.HttpError(xhr.statusText, xhr.status));
            };
            xhr.ontimeout = function () {
                _this.logger.log(ILogger_1.LogLevel.Warning, "Timeout from HTTP request.");
                reject(new Errors_1.TimeoutError());
            };
            xhr.send(request.content || "");
        });
    };
    return DefaultHttpClient;
}(HttpClient));
exports.DefaultHttpClient = DefaultHttpClient;
//# sourceMappingURL=HttpClient.js.map