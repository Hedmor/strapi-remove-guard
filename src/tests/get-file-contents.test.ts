import { getOriginalContent, getModifiedContent, getStagedContent } from '../file-utils';
import { getFileContents } from '../diff-helper';

jest.mock('../file-utils', () => ({
  getOriginalContent: jest.fn(),
  getModifiedContent: jest.fn(),
  getStagedContent: jest.fn(),
}));

describe('getFileContents', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Очистка моков перед каждым тестом
  });

  it('должна корректно возвращать содержимое всех трех версий файла', async () => {
    const mockFile = 'src/api/data.json';

    const originalContent = 'original content';
    const modifiedContent = 'modified content';
    const stagedContent = 'staged content';

    (getOriginalContent as jest.Mock).mockResolvedValue(originalContent);
    (getModifiedContent as jest.Mock).mockResolvedValue(modifiedContent);
    (getStagedContent as jest.Mock).mockResolvedValue(stagedContent);

    const result = await getFileContents(mockFile);

    expect(result).toEqual({
      original: originalContent,
      modified: modifiedContent,
      staged: stagedContent,
    });

    expect(getOriginalContent).toHaveBeenCalledWith(mockFile);
    expect(getModifiedContent).toHaveBeenCalledWith(mockFile);
    expect(getStagedContent).toHaveBeenCalledWith(mockFile);
  });

  it('должна обработать ошибку при получении оригинального содержимого', async () => {
    const mockFile = 'src/api/data.json';

    // Мокаем ошибку для одной из зависимостей
    (getOriginalContent as jest.Mock).mockRejectedValue(new Error('Error fetching original content'));

    try {
      await getFileContents(mockFile);
    } catch (error) {
      expect(error).toEqual(new Error('Error fetching original content'));
    }
  });

  it('должна возвращать правильное содержимое, если одна из зависимостей возвращает ошибку', async () => {
    const mockFile = 'src/api/data.json';

    const originalContent = 'original content';
    const stagedContent = 'staged content';

    // Мокаем ошибку для getModifiedContent
    (getOriginalContent as jest.Mock).mockResolvedValue(originalContent);
    (getModifiedContent as jest.Mock).mockRejectedValue(new Error('Error fetching modified content'));
    (getStagedContent as jest.Mock).mockResolvedValue(stagedContent);

    try {
      await getFileContents(mockFile);
    } catch (error) {
      expect(error).toEqual(new Error('Error fetching modified content'));
    }
  });
});
