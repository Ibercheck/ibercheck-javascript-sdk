module IbercheckApi.Errors {
    "use strict";

    export class NetworkError implements Error {
        public name: string = "NetworkError";
        public message: string;

        constructor(message?: string) {
            this.message = message;
        }
    }
}
