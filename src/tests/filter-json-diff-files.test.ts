import type { DiffResult } from 'simple-git';
import { filterJsonDiffFiles } from '../diff-helper';

describe('filterJsonDiffFiles', () => {
  const mockDiffFields: { similarity: number; changes: number; insertions: number; deletions: number; binary: false } =
    {
      similarity: 0,
      changes: 0,
      insertions: 0,
      deletions: 0,
      binary: false,
    };

  const getMockFileItem = (file: string) => ({ file, ...mockDiffFields });

  it('должна возвращать только JSON-файлы из src/api/ и src/components/', () => {
    const files: DiffResult['files'] = [
      getMockFileItem('src/api/data.json'),
      getMockFileItem('src/components/config.json'),
      getMockFileItem('src/utils/helpers.ts'),
      getMockFileItem('src/api/info.txt'),
      getMockFileItem('public/config.json'),
    ];

    expect(filterJsonDiffFiles(files)).toEqual(['src/api/data.json', 'src/components/config.json']);
  });

  it('должна возвращать пустой массив, если подходящих файлов нет', () => {
    const files: DiffResult['files'] = [
      getMockFileItem('src/utils/data.ts'),
      getMockFileItem('public/styles.css'),
      getMockFileItem('README.md'),
    ];

    expect(filterJsonDiffFiles(files)).toEqual([]);
  });

  it('должна корректно обрабатывать пустой список файлов', () => {
    expect(filterJsonDiffFiles([])).toEqual([]);
  });
});
