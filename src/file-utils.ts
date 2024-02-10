import git from './git-instance';
import { getTargetBranch } from './resolver';

/**
 * На основе Git, возвращает оригинальный контент файла.
 * Оригинальный - это контент файла в указанной ветке.
 *
 * Если файл не существует в указанной ветке, возвращает null.
 * @param file - Путь к файлу.
 * @returns - Оригинальный контент файла или null, если файл не существует в указанной ветке.
 */
export const getOriginalContent = async (file: string) => {
  const targetBranch = getTargetBranch();

  return await git.show([`${targetBranch}:${file}`]).catch(() => null);
};

/**
 * На основе Git возвращает измененный контент файла.
 * Измененный - это контент файла в текущей рабочей директории.
 *
 * @param file - Путь к файлу.
 * @returns - Измененный контент файла или null, если файл не был изменен.
 */
export const getModifiedContent = async (file: string) => {
  return await git.catFile(['-p', `HEAD:${file}`]).catch(() => null);
};

/**
 * На основе Git возвращает контент файла, который был закоммичен.
 * Закоммиченный - это контент файла в последнем коммите.
 *
 * @param file - Путь к файлу.
 * @returns - Закоммиченный контент файла или null, если файл не был закоммичен.
 */
export const getStagedContent = async (file: string) => {
  return await git.catFile(['-p', `:0:${file}`]).catch(() => null);
};
