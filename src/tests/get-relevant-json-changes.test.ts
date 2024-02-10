import { DiffResult } from 'simple-git';
import git from '../git-instance';
import { getRelevantJsonChanges } from '../diff-helper';

jest.mock('../git-instance');

describe('getRelevantJsonChanges', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должна возвращать измененные JSON-файлы из src/api и src/components', async () => {
    const mockDiffSummary: DiffResult = {
      files: [
        { file: 'src/api/data.json', similarity: 0, changes: 0, insertions: 0, deletions: 0, binary: false },
        { file: 'src/components/config.json', similarity: 0, changes: 0, insertions: 0, deletions: 0, binary: false },
        { file: 'src/utils/helpers.ts', similarity: 0, changes: 0, insertions: 0, deletions: 0, binary: false },
        { file: 'src/api/info.txt', similarity: 0, changes: 0, insertions: 0, deletions: 0, binary: false },
        { file: 'public/config.json', similarity: 0, changes: 0, insertions: 0, deletions: 0, binary: false },
      ],
      deletions: 0,
      insertions: 0,
      changed: 0,
    };

    jest.spyOn(git, 'diffSummary').mockResolvedValue(mockDiffSummary);

    const changedFiles = await getRelevantJsonChanges();
    expect(changedFiles).toEqual(['src/api/data.json', 'src/components/config.json']);
  });

  it('должна возвращать пустой список, если нет изменений в JSON-файлах в src/api и src/components', async () => {
    const mockDiffSummary: DiffResult = {
      files: [
        { file: 'src/utils/helpers.ts', similarity: 0, changes: 0, insertions: 0, deletions: 0, binary: false },
        { file: 'src/api/info.txt', similarity: 0, changes: 0, insertions: 0, deletions: 0, binary: false },
        { file: 'public/config.json', similarity: 0, changes: 0, insertions: 0, deletions: 0, binary: false },
      ],
      deletions: 0,
      insertions: 0,
      changed: 0,
    };

    jest.spyOn(git, 'diffSummary').mockResolvedValue(mockDiffSummary);

    const changedFiles = await getRelevantJsonChanges();
    expect(changedFiles).toEqual([]);
  });

  it('должна корректно обработать ошибку при вызове git.diffSummary', async () => {
    jest.spyOn(git, 'diffSummary').mockRejectedValue(new Error('Ошибка при получении данных'));

    try {
      await getRelevantJsonChanges();
    } catch (error) {
      expect(error).toEqual(new Error('Ошибка при получении данных'));
    }
  });
});
