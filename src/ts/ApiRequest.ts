namespace IbercheckApi {
    "use strict";

    export class ApiRequest {
        /**
         * Get data from the API
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @returns {Promise}
         */
        public static get(accessToken: string, endpoint: string): Promise<IGenericResponse> {
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
        public static post(accessToken: string, endpoint: string, data: {}): Promise<IGenericResponse> {
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
        public static patch(accessToken: string, endpoint: string, data: {}): Promise<IGenericResponse> {
            return this.ajax(endpoint, accessToken, {type: "PATCH", data: JSON.stringify(data), dataType: "json"});
        }

        /**
         * Realize a partial update.
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @param {Blob} file
         * @returns {Promise}
         */
        public static upload(accessToken: string, endpoint: string, file: Blob): Promise<IGenericResponse> {
            const payload = new FormData();
            payload.append("file", file);
            return this.ajax(
                endpoint,
                accessToken,
                {
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    data: payload,
                    dataType: "json",
                    processData: false, // Don't process the files
                    type: "POST",
                },
            );
        }

        /**
         * Error handler
         *
         * @param {JQueryXHR} jqXHR
         * @param {string} textStatus
         * @param {string|exception} errorThrown
         */
        public static errorMethod(jqXHR: JQueryXHR, textStatus: string, errorThrown: string): void {
            const Errors = IbercheckApi.Errors;

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
         * @param {any} response API response.
         * @throws {ValidationError} if it's a error response due input validation error.
         * @throws {ApiLogicError} for any other kind of error returned by the API.
         */
        public static testForLogicalError(response: any): void {
            const ApiErrors = IbercheckApi.Errors;

            if (response.validation_messages) {
                const messages = {};
                const object = response.validation_messages;
                for (const input in object) {
                    if (object.hasOwnProperty(input)) {
                        if (Array.isArray(object[input])) {
                            messages[input] = object[input][0];
                        } else if (jQuery.isPlainObject(object[input])) {
                            messages[input] = object[input][Object.keys(object[input])[0]];
                        }
                    }
                }
                throw new ApiErrors.ValidationError(response.status, response.title, response.detail, messages as {any: string});
            } else if (response.hasOwnProperty("detail")) {
                throw new ApiErrors.ApiLogicError(response.status, response.title, response.detail);
            }
        }

        public static ajax(endpoint: string, accessToken: string, ajaxOptions?: JQueryAjaxSettings): Promise<IGenericResponse> {
            return new Promise((resolve: (value: any) => void, reject: (reason: any) => void): void => {
                const settings: JQueryAjaxSettings = {
                    async: true,
                    contentType: "application/vnd.ibercheck.v1+json",
                    type: "GET",
                    url: endpoint,
                    beforeSend(jqXHR: JQueryXHR): void {
                        jqXHR.setRequestHeader("Authorization", "Bearer " + accessToken);
                    },
                };
                jQuery.extend(true, settings, ajaxOptions);
                jQuery.ajax(settings)
                    .then(
                        (data: any, textStatus: string, jqXHR: JQueryXHR): void => {
                            delete jqXHR.then; // treat xhr as a non-promise
                            try {
                                ApiRequest.testForLogicalError(data);
                            } catch (e) {
                                reject(e);
                                return;
                            }
                            resolve(data);
                        },
                        (jqXHR: JQueryXHR, textStatus: string, errorThrown: any): void => {
                            delete jqXHR.then; // treat xhr as a non-promise
                            try {
                                ApiRequest.errorMethod(jqXHR, textStatus, errorThrown);
                            } catch (e) {
                                reject(e);
                                return;
                            }
                            reject("unknown");
                        },
                    );
                },
            );
        }
    }
}
