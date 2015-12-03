declare module IbercheckApi {
    /**
     * Fields for generic responses
     */
    interface IGenericResponse {
        _links: {
            any?: Hal.Link;
        };
        any?: any;
    }
}
