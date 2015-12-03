module IbercheckApi {
    "use strict";

    export class ApiRequest {
        /**
         * Get data from the API
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @returns {Promise}
         */
        static get(accessToken: string, endpoint: string): Promise<IGenericResponse> {
            return this.ajax(endpoint, accessToken);
        }

        /**
         * Send a request to the server.
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @param {{}} data
         * @returns {Promise}
         */
        static post(accessToken: string, endpoint: string, data: {}): Promise<IGenericResponse> {
            return this.ajax(endpoint, accessToken, {type: "POST", data: JSON.stringify(data), dataType: "json"});
        }

        /**
         * Realize a partial update.
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @param {{}} data
         * @returns {Promise}
         */
        static patch(accessToken: string, endpoint: string, data: {}): Promise<IGenericResponse> {
            return this.ajax(endpoint, accessToken, {type: "PATCH", data: JSON.stringify(data), dataType: "json"});
        }

        /**
         * Realize a partial update.
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @param {HTMLInputElement} file
         * @returns {Promise}
         */
        static upload(accessToken: string, endpoint: string, file: HTMLInputElement): Promise<IGenericResponse> {
            let payload = new FormData();
            payload.append("file", file);
            return this.ajax(
                endpoint,
                accessToken,
                {
                    type: "POST",
                    data: payload,
                    dataType: "json",
                    processData: false, // Don't process the files
                    contentType: false // Set content type to false as jQuery will tell the server its a query string request
                }
            );
        }

        /**
         * Error handler
         *
         * @param {XMLHttpRequest} jqXHR
         * @param {string} textStatus
         * @param {string|exception} errorThrown
         */
        static errorMethod(jqXHR: XMLHttpRequest, textStatus: string, errorThrown: string): void {
            let Errors = IbercheckApi.Errors;

            if (jqXHR.status === 0) {
                throw new Errors.NetworkError();
            } else if (jqXHR.status === 404) {
                throw new Errors.NotFoundError();
            } else if (jqXHR.status === 500) {
                throw new Errors.ServerError();
            } else if (errorThrown === "parsererror") {
                throw new SyntaxError();
            } else if (errorThrown === "timeout") {
                throw new Errors.NetworkTimeoutError();
            } else if (errorThrown === "abort") {
                throw new Error("Aborted.");
            }

            if (!jqXHR.responseText) {
                throw new Error("Unknown");
            }

            ApiRequest.testForLogicalError(JSON.parse(jqXHR.responseText));

            throw new Error(jqXHR.responseText);
        }

        /**
         * Test if response is an error thrown by the API.
         *
         * @param {Apigility.ApplicationProblem} response API response.
         * @throws {ValidationError} if it's a error response due input validation error.
         * @throws {ApiLogicError} for any other kind of error returned by the API.
         */
        static testForLogicalError(response: Apigility.ApplicationProblem): void {
            let ApiErrors = IbercheckApi.Errors;

            if (response.validation_messages) {
                let messages = {};
                let object = response.validation_messages;
                for (let input in object) {
                    if (object.hasOwnProperty(input)) {
                        if (jQuery.isArray(object[input])) {
                            messages[input] = object[input][0];
                        } else if (jQuery.isPlainObject(object[input])) {
                            messages[input] = object[input][Object.keys(object[input])[0]];
                        }
                    }
                }
                throw new ApiErrors.ValidationError(response.status, response.title, response.detail, <{any: string}>messages);
            } else if (response.detail) {
                throw new ApiErrors.ApiLogicError(response.status, response.title, response.detail);
            }
        }

        static ajax(endpoint: string, accessToken: string, ajaxOptions?: JQueryAjaxSettings): Promise<IGenericResponse> {
            return new Promise((resolve: (value: any) => void, reject: (reason: any) => void): void => {
                let settings: JQueryAjaxSettings = {
                    type: "GET",
                    url: endpoint,
                    async: true,
                    contentType: "application/vnd.ibercheck.v1+json",
                    beforeSend: function (jqXHR: JQueryXHR): void {
                        jqXHR.setRequestHeader("Authorization", "Bearer " + accessToken);
                    }
                };
                jQuery.extend(true, settings, ajaxOptions);
                jQuery.ajax(settings)
                    .then(
                        function (data: any, textStatus: string, jqXHR: JQueryXHR): void {
                            delete jqXHR.then; // treat xhr as a non-promise
                            try {
                                ApiRequest.testForLogicalError(data);
                            } catch (e) {
                                reject(e);
                                return;
                            }
                            resolve(data);
                        },
                        function (jqXHR: JQueryXHR, textStatus: string, errorThrown: any): void {
                            delete jqXHR.then; // treat xhr as a non-promise
                            try {
                                ApiRequest.errorMethod(jqXHR, textStatus, errorThrown);
                            } catch (e) {
                                reject(e);
                                return;
                            }
                            reject("unknown");
                        }
                    );
                }
            );
        }
    }
}
