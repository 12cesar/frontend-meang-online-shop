import { map } from 'rxjs/internal/operators/map';
import { Injectable } from '@angular/core';
import { DASHBOARD_STATS_LEMENTS } from '@graphql/operations/query/dashboard';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends ApiService{

  constructor(apollo: Apollo) {
    super(apollo);
   }

  getStats(){
    return this.get(
      DASHBOARD_STATS_LEMENTS
    ).pipe(map((result: any) => {
      return{
        users: result.users,
        platforms: result.platforms,
        tags: result.tags,
        genres: result.genres,
        shopProducts: result.shopProducts,
        games: result.products
      };
    }));
  }
}
