namespace IbercheckApi.Errors {
    "use strict";

    export class NotFoundError implements Error {
        public name: string = "NotFoundError";
        public message: string;

        constructor(message?: string) {
            this.message = message;
        }
    }
}
