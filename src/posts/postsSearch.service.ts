import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Post from './post.entity';
import PostSearchBody from './types/postSearchBody.interface';

@Injectable()
export default class PostsSearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post) {
    return this.elasticsearchService.index({
      index: this.index,
      document: {
        id: post.id,
        title: post.title,
        authorId: post.author.id,
      },
    });
  }

  async count(query: string, fields: string[]) {
    const { count } = await this.elasticsearchService.count({
      index: this.index,
      query: {
        multi_match: {
          query,
          fields,
        },
      },
    });
    return count;
  }

  async search(text: string, offset?: number, limit?: number, startId = 0) {
    let separateCount = 0;
    if (startId) {
      separateCount = await this.count(text, ['title', 'paragraphs']);
    }
    const { hits } = await this.elasticsearchService.search<PostSearchBody>({
      index: this.index,
      from: offset,
      size: limit,
      query: {
        bool: {
          should: {
            multi_match: {
              query: text,
              fields: ['title', 'paragraphs'],
            },
          },
          filter: {
            range: {
              id: {
                gt: startId,
              },
            },
          },
        },
      },
      sort: {
        id: {
          order: 'asc',
        },
      },
    });

    const count = hits.total;
    const hitsResponse = hits.hits;
    const results = hitsResponse.map((item) => item._source);
    return {
      count: startId ? separateCount : count,
      results,
    };
  }

  async remove(postId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      query: {
        match: {
          id: postId,
        },
      },
    });
  }

  async update(post: Post) {
    const newBody: PostSearchBody = {
      id: post.id,
      title: post.title,
      authorId: post.author.id,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      query: {
        match: {
          id: post.id,
        },
      },
      script: script,
    });
  }
}
