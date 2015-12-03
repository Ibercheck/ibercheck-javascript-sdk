module IbercheckApi.Errors {
    "use strict";

    export class NetworkTimeoutError extends NetworkError {
        public name: string = "NetworkTimeoutError";

        constructor(message?: string) {
            super(message);
        }
    }
}
