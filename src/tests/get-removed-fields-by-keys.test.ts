import { getRemovedFieldsByKeys } from '../diff-helper';

describe('getRemovedFieldsByKeys', () => {
  it('должна возвращать удаленные поля', () => {
    const keys = {
      original: ['field1', 'field2', 'field3', 'field4'],
      modified: ['field2', 'field3'],
      staged: ['field3', 'field4'],
    };

    const removedFields = getRemovedFieldsByKeys(keys);
    expect(removedFields).toEqual(['field1']);
  });

  it('должна учитывать игнорируемые поля', () => {
    const keys = {
      original: ['field1', 'field2', 'field3'],
      modified: ['field2', 'field3'],
      staged: ['field3'],
    };

    const removedFields = getRemovedFieldsByKeys(keys);
    expect(removedFields).toEqual(['field1']);
  });

  it('должна вернуть пустой список, если нет удаленных полей', () => {
    const keys = {
      original: ['field1', 'field2'],
      modified: ['field1', 'field2'],
      staged: ['field1', 'field2'],
    };

    const removedFields = getRemovedFieldsByKeys(keys);
    expect(removedFields).toEqual([]);
  });
});
