import { createModels } from '../diff-helper';

describe('createModels', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должна корректно преобразовывать данные в модели', async () => {
    const mockChanges = new Map([
      ['src/api/data.json', { original: '{"key": "value"}', modified: '{"number": 42}', staged: '{"isValid": true}' }],
      [
        'src/components/config.json',
        { original: '{"config": "original"}', modified: '{"config": "updated"}', staged: '{"config": "staged"}' },
      ],
    ]);

    const result = await createModels(mockChanges);

    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(2);

    expect(result.get('src/api/data.json')).toEqual({
      original: { key: 'value' },
      modified: { number: 42 },
      staged: { isValid: true },
    });

    expect(result.get('src/components/config.json')).toEqual({
      original: { config: 'original' },
      modified: { config: 'updated' },
      staged: { config: 'staged' },
    });
  });

  it('должна выбрасывать ошибку при некорректном JSON', async () => {
    const mockChanges = new Map([
      [
        'src/api/data.json',
        { original: '{"valid": "json"}', modified: 'invalid json', staged: '{"another": "valid"}' },
      ],
    ]);

    await expect(createModels(mockChanges)).rejects.toThrow('Ошибка парсинга JSON');
  });
});
