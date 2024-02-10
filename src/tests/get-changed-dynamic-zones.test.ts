import { getChangedDynamicZones } from '../diff-helper';
import { StrapiModel } from '../types';

describe('getChangedDynamicZones', () => {
  it('должна находить dynamiczone-компоненты в каждой версии модели', () => {
    const original: StrapiModel = {
      kind: 'collectionType',
      collectionName: 'articles',
      info: { singularName: 'article', pluralName: 'articles', displayName: 'Article' },
      attributes: {
        title: { type: 'string' },
        sections: { type: 'dynamiczone', components: ['hero', 'text-block'] },
      },
    };

    const modified: StrapiModel = {
      ...original,
      attributes: {
        ...original.attributes,
        sections: { type: 'dynamiczone', components: ['hero', 'gallery', 'text-block'] },
      },
    };

    const staged: StrapiModel = {
      ...modified,
      attributes: {
        ...modified.attributes,
        sections: { type: 'dynamiczone', components: ['hero', 'gallery'] },
      },
    };

    const result = getChangedDynamicZones({ original, modified, staged });

    expect(result.original.get('sections')).toEqual(['hero', 'text-block']);
    expect(result.modified.get('sections')).toEqual(['hero', 'gallery', 'text-block']);
    expect(result.staged.get('sections')).toEqual(['hero', 'gallery']);
  });

  it('должна возвращать пустые Map, если dynamiczone отсутствуют', () => {
    const modelWithoutDynamicZone: StrapiModel = {
      kind: 'collectionType',
      collectionName: 'users',
      info: { singularName: 'user', pluralName: 'users', displayName: 'User' },
      attributes: {
        username: { type: 'string' },
        email: { type: 'email' },
      },
    };

    const result = getChangedDynamicZones({
      original: modelWithoutDynamicZone,
      modified: modelWithoutDynamicZone,
      staged: modelWithoutDynamicZone,
    });

    expect(result.original.size).toBe(0);
    expect(result.modified.size).toBe(0);
    expect(result.staged.size).toBe(0);
  });

  it('должна корректно обрабатывать пустые модели', () => {
    const emptyModel: StrapiModel = {
      kind: 'collectionType',
      collectionName: 'empty',
      info: { singularName: 'empty', pluralName: 'empties', displayName: 'Empty' },
      attributes: {},
    };

    const result = getChangedDynamicZones({
      original: emptyModel,
      modified: emptyModel,
      staged: emptyModel,
    });

    expect(result.original.size).toBe(0);
    expect(result.modified.size).toBe(0);
    expect(result.staged.size).toBe(0);
  });
});
