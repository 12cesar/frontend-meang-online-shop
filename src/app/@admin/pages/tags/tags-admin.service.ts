import { ADD_TAG, MODIFY_TAG, BLOCK_TAG } from '@graphql/operations/mutation/tag';
import { Apollo } from 'apollo-angular';
import { ApiService } from '@graphql/services/api.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagsAdminService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
   }

  add(tag: string){
    return this.set(
      ADD_TAG,
      {
        tag
      },
      {}
    ).pipe(map((result: any) => {
      return result.addTag;
    }));
  }
  update(id: string, tag: string){
    return this.set(
      MODIFY_TAG,
      {
        id,
        tag
      },
      {}
    ).pipe(map((result: any) => {
      return result.updateTag;
    }));
  }
  block(id: string){
    return this.set(
      BLOCK_TAG,
      {
        id
      },
      {}
    ).pipe(map((result: any) => {
      return result.blockTag;
    }));
  }
}
