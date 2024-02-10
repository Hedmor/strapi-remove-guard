import { getParsedContent } from '../diff-helper';

describe('getParsedContent', () => {
  it('должна корректно парсить валидный JSON', async () => {
    const content = {
      original: '{"key": "value"}',
      modified: '{"number": 42}',
      staged: '{"isValid": true}',
    };

    const result = await getParsedContent(content);

    expect(result).toEqual({
      original: { key: 'value' },
      modified: { number: 42 },
      staged: { isValid: true },
    });
  });

  it('должна возвращать null, если одно из значений равно null', async () => {
    const content = {
      original: null,
      modified: '{"number": 42}',
      staged: null,
    };

    const result = await getParsedContent(content);

    expect(result).toEqual({
      original: null,
      modified: { number: 42 },
      staged: null,
    });
  });

  it('должна выбрасывать ошибку при некорректном JSON', async () => {
    const content = {
      original: '{"valid": "json"}',
      modified: 'invalid json',
      staged: '{"another": "valid"}',
    };

    await expect(getParsedContent(content)).rejects.toThrow('Ошибка парсинга JSON');
  });
});
