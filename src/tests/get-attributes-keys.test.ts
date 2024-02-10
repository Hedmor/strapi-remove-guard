import { getAttributesKeys } from '../diff-helper';
import { StrapiModel } from '../types';

describe('getAttributesKeys', () => {
  it('должна возвращать ключи атрибутов для всех версий модели', () => {
    const original: StrapiModel = {
      kind: 'collectionType',
      collectionName: 'articles',
      info: {
        singularName: 'article',
        pluralName: 'articles',
        displayName: 'Article',
      },
      attributes: {
        title: { type: 'string', required: true },
        content: { type: 'richtext' },
      },
    };

    const modified: StrapiModel = {
      kind: 'collectionType',
      collectionName: 'articles',
      info: {
        singularName: 'article',
        pluralName: 'articles',
        displayName: 'Article',
      },
      attributes: {
        title: { type: 'string', required: true },
        content: { type: 'richtext' },
        category: { type: 'enumeration', enum: ['news', 'blog'], default: 'news' },
      },
    };

    const staged: StrapiModel = {
      kind: 'collectionType',
      collectionName: 'articles',
      info: {
        singularName: 'article',
        pluralName: 'articles',
        displayName: 'Article',
      },
      attributes: {
        title: { type: 'string', required: true },
        category: { type: 'enumeration', enum: ['news', 'blog'], default: 'news' },
      },
    };

    const result = getAttributesKeys({ original, modified, staged });

    expect(result).toEqual({
      original: ['title', 'content'],
      modified: ['title', 'content', 'category'],
      staged: ['title', 'category'],
    });
  });

  it('должна возвращать пустые массивы, если атрибутов нет', () => {
    const emptyModel: StrapiModel = {
      kind: 'collectionType',
      collectionName: 'empty',
      info: {
        singularName: 'empty',
        pluralName: 'empties',
        displayName: 'Empty Model',
      },
      attributes: {},
    };

    const result = getAttributesKeys({
      original: emptyModel,
      modified: emptyModel,
      staged: emptyModel,
    });

    expect(result).toEqual({
      original: [],
      modified: [],
      staged: [],
    });
  });
});
