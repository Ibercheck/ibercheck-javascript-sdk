var IbercheckApi;
(function (IbercheckApi) {
    "use strict";
    var ApiRequest = (function () {
        function ApiRequest() {
        }
        /**
         * Get data from the API
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @returns {Promise}
         */
        ApiRequest.get = function (accessToken, endpoint) {
            return this.ajax(endpoint, accessToken);
        };
        /**
         * Send a request to the server.
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @param {{}} data
         * @returns {Promise}
         */
        ApiRequest.post = function (accessToken, endpoint, data) {
            return this.ajax(endpoint, accessToken, { type: "POST", data: JSON.stringify(data), dataType: "json" });
        };
        /**
         * Realize a partial update.
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @param {{}} data
         * @returns {Promise}
         */
        ApiRequest.patch = function (accessToken, endpoint, data) {
            return this.ajax(endpoint, accessToken, { type: "PATCH", data: JSON.stringify(data), dataType: "json" });
        };
        /**
         * Realize a partial update.
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @param {HTMLInputElement} file
         * @returns {Promise}
         */
        ApiRequest.upload = function (accessToken, endpoint, file) {
            var payload = new FormData();
            payload.append("file", file);
            return this.ajax(endpoint, accessToken, {
                type: "POST",
                data: payload,
                dataType: "json",
                processData: false,
                contentType: false // Set content type to false as jQuery will tell the server its a query string request
            });
        };
        /**
         * Error handler
         *
         * @param {XMLHttpRequest} jqXHR
         * @param {string} textStatus
         * @param {string|exception} errorThrown
         */
        ApiRequest.errorMethod = function (jqXHR, textStatus, errorThrown) {
            var Errors = IbercheckApi.Errors;
            if (jqXHR.status === 0) {
                throw new Errors.NetworkError();
            }
            else if (jqXHR.status === 404) {
                throw new Errors.NotFoundError();
            }
            else if (jqXHR.status === 500) {
                throw new Errors.ServerError();
            }
            else if (errorThrown === "parsererror") {
                throw new SyntaxError();
            }
            else if (errorThrown === "timeout") {
                throw new Errors.NetworkTimeoutError();
            }
            else if (errorThrown === "abort") {
                throw new Error("Aborted.");
            }
            if (!jqXHR.responseText) {
                throw new Error("Unknown");
            }
            ApiRequest.testForLogicalError(JSON.parse(jqXHR.responseText));
            throw new Error(jqXHR.responseText);
        };
        /**
         * Test if response is an error thrown by the API.
         *
         * @param {Apigility.ApplicationProblem} response API response.
         * @throws {ValidationError} if it's a error response due input validation error.
         * @throws {ApiLogicError} for any other kind of error returned by the API.
         */
        ApiRequest.testForLogicalError = function (response) {
            var ApiErrors = IbercheckApi.Errors;
            if (response.validation_messages) {
                var messages = {};
                var object = response.validation_messages;
                for (var input in object) {
                    if (object.hasOwnProperty(input)) {
                        if (jQuery.isArray(object[input])) {
                            messages[input] = object[input][0];
                        }
                        else if (jQuery.isPlainObject(object[input])) {
                            messages[input] = object[input][Object.keys(object[input])[0]];
                        }
                    }
                }
                throw new ApiErrors.ValidationError(response.status, response.title, response.detail, messages);
            }
            else if (response.detail) {
                throw new ApiErrors.ApiLogicError(response.status, response.title, response.detail);
            }
        };
        ApiRequest.ajax = function (endpoint, accessToken, ajaxOptions) {
            return new Promise(function (resolve, reject) {
                var settings = {
                    type: "GET",
                    url: endpoint,
                    async: true,
                    contentType: "application/vnd.ibercheck.v1+json",
                    beforeSend: function (jqXHR) {
                        jqXHR.setRequestHeader("Authorization", "Bearer " + accessToken);
                    }
                };
                jQuery.extend(true, settings, ajaxOptions);
                jQuery.ajax(settings)
                    .then(function (data, textStatus, jqXHR) {
                    delete jqXHR.then; // treat xhr as a non-promise
                    try {
                        ApiRequest.testForLogicalError(data);
                    }
                    catch (e) {
                        reject(e);
                        return;
                    }
                    resolve(data);
                }, function (jqXHR, textStatus, errorThrown) {
                    delete jqXHR.then; // treat xhr as a non-promise
                    try {
                        ApiRequest.errorMethod(jqXHR, textStatus, errorThrown);
                    }
                    catch (e) {
                        reject(e);
                        return;
                    }
                    reject("unknown");
                });
            });
        };
        return ApiRequest;
    })();
    IbercheckApi.ApiRequest = ApiRequest;
})(IbercheckApi || (IbercheckApi = {}));
var IbercheckApi;
(function (IbercheckApi) {
    "use strict";
    /**
     * Notify the application from events in other windows.
     */
    var AuthorizationOnlineSignature = (function () {
        /**
         * @param {string} apiHost
         */
        function AuthorizationOnlineSignature(apiHost) {
            this.apiHost = apiHost;
        }
        /**
         * Listen for authorization result events.
         *
         * @returns {Promise<IGenericResponse>}
         */
        AuthorizationOnlineSignature.prototype.waitForResult = function () {
            var _this = this;
            // Create IE + others compatible event handler
            var addEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var removeEventMethod = window.removeEventListener ? "removeEventListener" : "detachEvent";
            var messageEvent = addEventMethod === "attachEvent" ? "onmessage" : "message";
            return new Promise(function (resolve, reject) {
                var messageCallback = function (event) {
                    if (event.origin !== _this.apiHost) {
                        return;
                    }
                    var data = JSON.parse(event.data);
                    try {
                        IbercheckApi.ApiRequest.testForLogicalError(data);
                    }
                    catch (e) {
                        reject(e);
                        return;
                    }
                    finally {
                        window[removeEventMethod](messageEvent, messageCallback, false);
                    }
                    resolve(data);
                };
                window[addEventMethod](messageEvent, messageCallback, false);
            });
        };
        return AuthorizationOnlineSignature;
    })();
    IbercheckApi.AuthorizationOnlineSignature = AuthorizationOnlineSignature;
})(IbercheckApi || (IbercheckApi = {}));
var IbercheckApi;
(function (IbercheckApi) {
    var Errors;
    (function (Errors) {
        "use strict";
        var ApiLogicError = (function () {
            /**
             * @param {number} code ApplicationProblem `status` field.
             * @param {string} name ApplicationProblem `title` field.
             * @param {string} message ApplicationProblem `detail` field.
             */
            function ApiLogicError(code, name, message) {
                this.code = code;
                this.name = name;
                this.message = message;
            }
            return ApiLogicError;
        })();
        Errors.ApiLogicError = ApiLogicError;
    })(Errors = IbercheckApi.Errors || (IbercheckApi.Errors = {}));
})(IbercheckApi || (IbercheckApi = {}));
var IbercheckApi;
(function (IbercheckApi) {
    var Errors;
    (function (Errors) {
        "use strict";
        var NetworkError = (function () {
            function NetworkError(message) {
                this.name = "NetworkError";
                this.message = message;
            }
            return NetworkError;
        })();
        Errors.NetworkError = NetworkError;
    })(Errors = IbercheckApi.Errors || (IbercheckApi.Errors = {}));
})(IbercheckApi || (IbercheckApi = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IbercheckApi;
(function (IbercheckApi) {
    var Errors;
    (function (Errors) {
        "use strict";
        var NetworkTimeoutError = (function (_super) {
            __extends(NetworkTimeoutError, _super);
            function NetworkTimeoutError(message) {
                _super.call(this, message);
                this.name = "NetworkTimeoutError";
            }
            return NetworkTimeoutError;
        })(Errors.NetworkError);
        Errors.NetworkTimeoutError = NetworkTimeoutError;
    })(Errors = IbercheckApi.Errors || (IbercheckApi.Errors = {}));
})(IbercheckApi || (IbercheckApi = {}));
var IbercheckApi;
(function (IbercheckApi) {
    var Errors;
    (function (Errors) {
        "use strict";
        var NotFoundError = (function () {
            function NotFoundError(message) {
                this.name = "NotFoundError";
                this.message = message;
            }
            return NotFoundError;
        })();
        Errors.NotFoundError = NotFoundError;
    })(Errors = IbercheckApi.Errors || (IbercheckApi.Errors = {}));
})(IbercheckApi || (IbercheckApi = {}));
var IbercheckApi;
(function (IbercheckApi) {
    var Errors;
    (function (Errors) {
        "use strict";
        var ServerError = (function () {
            function ServerError(message) {
                this.name = "ServerError";
                this.message = message;
            }
            return ServerError;
        })();
        Errors.ServerError = ServerError;
    })(Errors = IbercheckApi.Errors || (IbercheckApi.Errors = {}));
})(IbercheckApi || (IbercheckApi = {}));
var IbercheckApi;
(function (IbercheckApi) {
    var Errors;
    (function (Errors) {
        "use strict";
        var ValidationError = (function (_super) {
            __extends(ValidationError, _super);
            /**
             * @param {number} code ApplicationProblem `status` field.
             * @param {string} name ApplicationProblem `title` field.
             * @param {string} message ApplicationProblem `detail` field.
             * @param {{any: {string}}} messages ApplicationProblem `validation_messages` field.
             */
            function ValidationError(code, name, message, messages) {
                _super.call(this, code, name, message);
                this.messages = messages;
            }
            return ValidationError;
        })(Errors.ApiLogicError);
        Errors.ValidationError = ValidationError;
    })(Errors = IbercheckApi.Errors || (IbercheckApi.Errors = {}));
})(IbercheckApi || (IbercheckApi = {}));
var IbercheckApi;
(function (IbercheckApi) {
    var Helper;
    (function (Helper) {
        "use strict";
        var HalLink = (function () {
            function HalLink() {
            }
            /**
             * Indicate if the model has the specified link.
             *
             * @param {IGenericResponse} model Model.
             * @param {string} relational Link name.
             * @returns {boolean}
             */
            HalLink.hasLink = function (model, relational) {
                return (model._links.hasOwnProperty(relational));
            };
            /**
             * Returns the payment step URI.
             *
             * @param {IGenericResponse} model Model.
             * @param {string} relational Link name.
             * @returns {Hal.Link}
             * @throws error if cannot return the URI.
             */
            HalLink.getLink = function (model, relational) {
                if (!this.hasLink(model, relational)) {
                    throw new Error("There is no link with the desired relational. Use hasLink() to test this");
                }
                return model._links[relational];
            };
            return HalLink;
        })();
        Helper.HalLink = HalLink;
    })(Helper = IbercheckApi.Helper || (IbercheckApi.Helper = {}));
})(IbercheckApi || (IbercheckApi = {}));
