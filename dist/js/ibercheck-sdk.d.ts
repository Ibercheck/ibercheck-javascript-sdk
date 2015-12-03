declare module IbercheckApi {
    class ApiRequest {
        /**
         * Get data from the API
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @returns {Promise}
         */
        static get(accessToken: string, endpoint: string): Promise<IGenericResponse>;
        /**
         * Send a request to the server.
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @param {{}} data
         * @returns {Promise}
         */
        static post(accessToken: string, endpoint: string, data: {}): Promise<IGenericResponse>;
        /**
         * Realize a partial update.
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @param {{}} data
         * @returns {Promise}
         */
        static patch(accessToken: string, endpoint: string, data: {}): Promise<IGenericResponse>;
        /**
         * Realize a partial update.
         *
         * @param {string} accessToken
         * @param {string} endpoint
         * @param {HTMLInputElement} file
         * @returns {Promise}
         */
        static upload(accessToken: string, endpoint: string, file: HTMLInputElement): Promise<IGenericResponse>;
        /**
         * Error handler
         *
         * @param {XMLHttpRequest} jqXHR
         * @param {string} textStatus
         * @param {string|exception} errorThrown
         */
        static errorMethod(jqXHR: XMLHttpRequest, textStatus: string, errorThrown: string): void;
        /**
         * Test if response is an error thrown by the API.
         *
         * @param {Apigility.ApplicationProblem} response API response.
         * @throws {ValidationError} if it's a error response due input validation error.
         * @throws {ApiLogicError} for any other kind of error returned by the API.
         */
        static testForLogicalError(response: Apigility.ApplicationProblem): void;
        static ajax(endpoint: string, accessToken: string, ajaxOptions?: JQueryAjaxSettings): Promise<IGenericResponse>;
    }
}
declare module IbercheckApi {
    /**
     * Notify the application from events in other windows.
     */
    class AuthorizationOnlineSignature {
        apiHost: string;
        /**
         * @param {string} apiHost
         */
        constructor(apiHost: string);
        /**
         * Listen for authorization result events.
         *
         * @returns {Promise<IGenericResponse>}
         */
        waitForResult(): Promise<IGenericResponse>;
    }
}
declare module IbercheckApi.Errors {
    class ApiLogicError implements Error {
        code: number;
        message: string;
        name: string;
        /**
         * @param {number} code ApplicationProblem `status` field.
         * @param {string} name ApplicationProblem `title` field.
         * @param {string} message ApplicationProblem `detail` field.
         */
        constructor(code: number, name: string, message: string);
    }
}
declare module IbercheckApi.Errors {
    class NetworkError implements Error {
        name: string;
        message: string;
        constructor(message?: string);
    }
}
declare module IbercheckApi.Errors {
    class NetworkTimeoutError extends NetworkError {
        name: string;
        constructor(message?: string);
    }
}
declare module IbercheckApi.Errors {
    class NotFoundError implements Error {
        name: string;
        message: string;
        constructor(message?: string);
    }
}
declare module IbercheckApi.Errors {
    class ServerError implements Error {
        name: string;
        message: string;
        constructor(message?: string);
    }
}
declare module IbercheckApi.Errors {
    class ValidationError extends ApiLogicError {
        messages: {
            any: string;
        };
        /**
         * @param {number} code ApplicationProblem `status` field.
         * @param {string} name ApplicationProblem `title` field.
         * @param {string} message ApplicationProblem `detail` field.
         * @param {{any: {string}}} messages ApplicationProblem `validation_messages` field.
         */
        constructor(code: number, name: string, message: string, messages: {
            any: string;
        });
    }
}
declare module IbercheckApi.Helper {
    class HalLink {
        /**
         * Indicate if the model has the specified link.
         *
         * @param {IGenericResponse} model Model.
         * @param {string} relational Link name.
         * @returns {boolean}
         */
        static hasLink(model: IGenericResponse, relational: string): boolean;
        /**
         * Returns the payment step URI.
         *
         * @param {IGenericResponse} model Model.
         * @param {string} relational Link name.
         * @returns {Hal.Link}
         * @throws error if cannot return the URI.
         */
        static getLink(model: IGenericResponse, relational: string): Hal.Link;
    }
}
