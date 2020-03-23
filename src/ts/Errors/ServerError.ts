namespace IbercheckApi.Errors {
    "use strict";

    export class ServerError implements Error {
        public name: string = "ServerError";
        public message: string;

        constructor(message?: string) {
            this.message = message;
        }
    }
}
