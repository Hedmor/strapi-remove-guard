import { getRemovedComponents } from '../diff-helper';
import { StrapiModel } from '../types';

describe('getRemovedComponents', () => {
  it('должна находить удаленные компоненты между original, modified и staged', () => {
    const original: StrapiModel = {
      kind: 'collectionType',
      collectionName: 'articles',
      info: { singularName: 'article', pluralName: 'articles', displayName: 'Article' },
      attributes: {
        sections: { type: 'dynamiczone', components: ['hero', 'text-block', 'gallery'] },
      },
    };

    const modified: StrapiModel = {
      ...original,
      attributes: {
        sections: { type: 'dynamiczone', components: ['hero', 'image-block'] },
      },
    };

    const staged: StrapiModel = {
      ...modified,
      attributes: {
        sections: { type: 'dynamiczone', components: ['hero'] },
      },
    };

    const result = getRemovedComponents({
      original,
      modified,
      staged,
    });

    expect(result.get('sections')).toEqual(['text-block', 'gallery']);
  });

  it('должна возвращать пустой результат, если нет изменений', () => {
    const model: StrapiModel = {
      kind: 'collectionType',
      collectionName: 'users',
      info: { singularName: 'user', pluralName: 'users', displayName: 'User' },
      attributes: {
        profile: { type: 'dynamiczone', components: ['profile-header'] },
      },
    };

    const result = getRemovedComponents({
      original: model,
      modified: model,
      staged: model,
    });

    expect(result.size).toBe(0); // Нет изменений, значит ничего не удалено
  });
});
