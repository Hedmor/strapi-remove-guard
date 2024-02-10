import { getChangedFilesDetails } from '../diff-helper';
import { getOriginalContent, getModifiedContent, getStagedContent } from '../file-utils';

jest.mock('../file-utils', () => ({
  getOriginalContent: jest.fn(),
  getModifiedContent: jest.fn(),
  getStagedContent: jest.fn(),
}));

describe('getChangedFilesDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должна возвращать корректные данные для списка измененных файлов', async () => {
    const changedFiles = ['src/api/data.json', 'src/components/config.json'];

    const mockContents: Record<string, { original: string | null; modified: string | null; staged: string | null }> = {
      'src/api/data.json': { original: 'original api', modified: 'modified api', staged: 'staged api' },
      'src/components/config.json': {
        original: 'original config',
        modified: 'modified config',
        staged: 'staged config',
      },
    };

    (getOriginalContent as jest.Mock).mockImplementation((file: string) =>
      Promise.resolve(mockContents[file]?.original ?? null),
    );
    (getModifiedContent as jest.Mock).mockImplementation((file) =>
      Promise.resolve(mockContents[file]?.modified ?? null),
    );
    (getStagedContent as jest.Mock).mockImplementation((file) => Promise.resolve(mockContents[file]?.staged ?? null));

    const result = await getChangedFilesDetails(changedFiles);

    expect(result.get('src/api/data.json')).toEqual({
      original: 'original api',
      modified: 'modified api',
      staged: 'staged api',
    });

    expect(result.get('src/components/config.json')).toEqual({
      original: 'original config',
      modified: 'modified config',
      staged: 'staged config',
    });

    expect(getOriginalContent).toHaveBeenCalledTimes(2);
    expect(getModifiedContent).toHaveBeenCalledTimes(2);
    expect(getStagedContent).toHaveBeenCalledTimes(2);
  });

  it('должна корректно обрабатывать файлы, для которых нет оригинального содержимого', async () => {
    const changedFiles = ['src/api/data.json'];

    (getOriginalContent as jest.Mock).mockResolvedValue(null);
    (getModifiedContent as jest.Mock).mockResolvedValue('modified api');
    (getStagedContent as jest.Mock).mockResolvedValue('staged api');

    const result = await getChangedFilesDetails(changedFiles);

    expect(result.get('src/api/data.json')).toEqual({
      original: null,
      modified: 'modified api',
      staged: 'staged api',
    });
  });

  it('должна корректно обрабатывать файлы, для которых произошла ошибка при получении данных', async () => {
    const changedFiles = ['src/api/data.json'];

    (getOriginalContent as jest.Mock).mockRejectedValue(new Error('Ошибка получения оригинального файла'));
    (getModifiedContent as jest.Mock).mockResolvedValue('modified api');
    (getStagedContent as jest.Mock).mockResolvedValue('staged api');

    await expect(getChangedFilesDetails(changedFiles)).rejects.toThrow('Ошибка получения оригинального файла');
  });
});
