namespace IbercheckApi.Helper {
    "use strict";

    export class HalLink {

        /**
         * Indicate if the model has the specified link.
         *
         * @param {IGenericResponse} model Model.
         * @param {string} relational Link name.
         * @returns {boolean}
         */
        public static hasLink(model: IGenericResponse, relational: string): boolean {
            return (model._links.hasOwnProperty(relational));
        }

        /**
         * Returns the payment step URI.
         *
         * @param {IGenericResponse} model Model.
         * @param {string} relational Link name.
         * @returns {Hal.Link}
         * @throws error if cannot return the URI.
         */
        public static getLink(model: IGenericResponse, relational: string): Hal.Link {
            if (!this.hasLink(model, relational)) {
                throw new Error("There is no link with the desired relational. Use hasLink() to test this");
            }

            return model._links[relational];
        }
    }
}
