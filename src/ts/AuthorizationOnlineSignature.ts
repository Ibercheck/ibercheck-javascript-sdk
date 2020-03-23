namespace IbercheckApi {
    "use strict";

    /**
     * Notify the application from events in other windows.
     */
    export class AuthorizationOnlineSignature {
        public readonly apiHost: string;

        /**
         * @param {string} apiHost
         */
        constructor(apiHost: string) {
            this.apiHost = apiHost;
        }

        /**
         * Listen for authorization result events.
         *
         * @returns {Promise<IGenericResponse>}
         */
        public waitForResult(): Promise<IGenericResponse> {
            // Create IE + others compatible event handler
            const addEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            const removeEventMethod = window.removeEventListener ? "removeEventListener" : "detachEvent";
            const messageEvent = addEventMethod === "attachEvent" ? "onmessage" : "message";

            return new Promise((resolve: (value: any) => void, reject: (reason: any) => void): void => {
                const messageCallback = (event: MessageEvent): void => {
                    if (event.origin !== this.apiHost) {
                        return;
                    }

                    const data = JSON.parse(event.data);
                    try {
                        ApiRequest.testForLogicalError(data);
                    } catch (e) {
                        reject(e);
                        return;
                    } finally {
                        window[removeEventMethod](messageEvent, messageCallback, false);
                    }

                    resolve(data);
                };

                window[addEventMethod](messageEvent, messageCallback, false);
            });
        }
    }
}
