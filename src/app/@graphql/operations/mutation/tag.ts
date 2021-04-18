import { TAG_FRAGMENT } from './../fragment/tag';
import gql from 'graphql-tag';

export const ADD_TAG = gql `
    mutation insertarTag($tag:String!){
        addTag(tag:$tag){
            status
            message
            tag{
                ...TagObject
            }
        }
    }
    ${TAG_FRAGMENT}
`;
export const MODIFY_TAG = gql`
    mutation actualizarTag($id:ID!, $tag:String!){
        updateTag(id:$id, tag: $tag){
            status
            message
            tag{
                ...TagObject
            }
        }
    }
    ${TAG_FRAGMENT}
`;
export const BLOCK_TAG = gql `
    mutation bloquearTag($id:ID!){
        blockTag(id:$id){
            status
            message
        }
    }
`;