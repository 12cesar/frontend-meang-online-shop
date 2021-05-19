// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backend: 'http://localhost:2002/graphql',
  backendWs: 'ws://gamezonia-online.herokuapp.com/graphql',
  stripePublicKey: 'pk_test_51IppknF7ZssJSc12aYT2CmzsbPnMm9td4RjgDzBrG4tQ9oRGW6qe4JKJjkysBRAzE1jSLk6GYZG4xgo6qC3q5Dbh00jvdiBWkq'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
