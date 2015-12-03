module IbercheckApi.Errors {
    "use strict";

    export class ValidationError extends ApiLogicError {
        public messages: {any: string};

        /**
         * @param {number} code ApplicationProblem `status` field.
         * @param {string} name ApplicationProblem `title` field.
         * @param {string} message ApplicationProblem `detail` field.
         * @param {{any: {string}}} messages ApplicationProblem `validation_messages` field.
         */
        constructor(code: number, name: string, message: string, messages: {any: string}) {
            super(code, name, message);
            this.messages = messages;
        }
    }
}
