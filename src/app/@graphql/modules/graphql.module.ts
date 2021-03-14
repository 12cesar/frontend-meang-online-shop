import { onError } from 'apollo-link-error';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import {ApolloLink} from 'apollo-link';
import { NgModule } from '@angular/core';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule } from '@angular/common/http';
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
    const uri = 'http://localhost:2002/graphql';
    const link = ApolloLink.from([
      errorLink,
      httplink.create({uri})
    ]);
    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}
