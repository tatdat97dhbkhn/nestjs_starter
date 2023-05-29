// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/typescript.html
import PostSearchBody from './postSearchBody.interface';

interface PostSearchResult {
  hits: {
    total: {
      value: number;
    };
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}

export default PostSearchResult;
