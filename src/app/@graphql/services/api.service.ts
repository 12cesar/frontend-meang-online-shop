import { Injectable } from '@angular/core';
import { IRegisterForm } from '@core/interfaces/register.interface';
import { REGISTER_USER } from '@graphql/operations/mutation/user';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private apollo: Apollo) {}
  protected get(
    query: DocumentNode,
    variables: object = {},
    context: object = {},
    cache: boolean = true
  ) {
    return this.apollo
      .watchQuery({
        query,
        variables,
        context,
        fetchPolicy: (cache) ? 'network-only' : 'no-cache',
      })
      .valueChanges.pipe(
        map((result) => {
          return result.data;
        })
      );
  }
  protected set(
    mutation: DocumentNode,
    variables: object = {},
    context: object = {}
  ) {
    return this.apollo
      .mutate({
        mutation,
        variables,
        context,
      })
      .pipe(
        map((result) => {
          return result.data;
        })
      );
  }
  protected subscription(
    subscription: DocumentNode,
    variables: object = {}
  ) {
    return this.apollo
      .subscribe({
        query: subscription,
        variables
      })
      .pipe(
        map((result) => {
          return result.data;
        })
      );
  }
}
