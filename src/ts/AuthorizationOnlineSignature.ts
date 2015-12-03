module IbercheckApi {
    "use strict";

    /**
     * Notify the application from events in other windows.
     */
    export class AuthorizationOnlineSignature {
        apiHost: string;

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
        waitForResult(): Promise<IGenericResponse> {
            // Create IE + others compatible event handler
            let addEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            let removeEventMethod = window.removeEventListener ? "removeEventListener" : "detachEvent";
            let messageEvent = addEventMethod === "attachEvent" ? "onmessage" : "message";

            return new Promise((resolve: (value: any) => void, reject: (reason: any) => void): void => {
                let messageCallback = (event: MessageEvent): void => {
                    if (event.origin !== this.apiHost) {
                        return;
                    }

                    let data = JSON.parse(event.data);
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
