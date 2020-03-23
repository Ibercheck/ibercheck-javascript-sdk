namespace IbercheckApi.Errors {
    "use strict";

    export class ApiLogicError implements Error {
        public code: number;
        public message: string;
        public name: string;

        /**
         * @param {number} code ApplicationProblem `status` field.
         * @param {string} name ApplicationProblem `title` field.
         * @param {string} message ApplicationProblem `detail` field.
         */
        constructor(code: number, name: string, message: string) {
            this.code = code;
            this.name = name;
            this.message = message;
        }
    }
}
