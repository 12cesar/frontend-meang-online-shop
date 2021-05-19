import { onError } from 'apollo-link-error';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import {ApolloLink, split} from 'apollo-link';
import { NgModule } from '@angular/core';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
@NgModule({
  imports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ],
})
export class GraphqlModule {
  constructor(apollo: Apollo, httplink: HttpLink) {
    // Para capturar los errores de consulta o de red
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        console.log('GraphQL Error', graphQLErrors);
      }
      if (networkError) {
        console.log('network error', networkError);
      }
    });
    const uri = environment.backend;
    const urlLink = ApolloLink.from([
      errorLink,
      httplink.create({uri})
    ]);
    const subscriptionLin = new WebSocketLink({
      uri: environment.backendWs,
      options: {
        reconnect: true
      }
    });
    const link = split(
      ({query}) => {
        const {kind, operation}: any = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      subscriptionLin,
      urlLink
    );
    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}
