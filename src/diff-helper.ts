import { DiffResult } from 'simple-git';
import git from './git-instance';
import { ignoredFields } from './constants';
import { getOriginalContent, getModifiedContent, getStagedContent } from './file-utils';
import { Content, Models, StrapiAttribute, StrapiModel } from './types';
import { logger } from './logger';
import { green } from 'picocolors';
import { getTargetBranch } from './resolver';

/**
 * Фильтрует измененные файлы, оставляя только JSON-файлы
 * из папок `src/api/` или `src/components/`.
 *
 * @param files - Список измененных файлов из `simple-git`.
 * @returns - Массив путей к отфильтрованным файлам.
 */
export const filterJsonDiffFiles = (files: DiffResult['files']): string[] =>
  files.flatMap(({ file }) => (file.endsWith('.json') && /^(src\/api\/|src\/components\/)/.test(file) ? [file] : []));

export const getRelevantJsonChanges = async () => {
  const targetBranch = getTargetBranch();
  const diffSummary = await git.diffSummary([targetBranch]);

  const changedFiles = filterJsonDiffFiles(diffSummary.files);

  if (changedFiles.length === 0) {
    logger.info(green(`Нет изменений в JSON-файлах в папках src/api или src/components`));
  }

  return changedFiles;
};

/**
 * Загружает содержимое файла в трех состояниях: оригинальное, измененное и добавленное в staging.
 *
 * @param file - Путь к файлу, для которого нужно получить содержимое.
 * @returns - Объект с содержимым: original, modified и staged.
 */
export const getFileContents = async (file: string) => {
  const originalContent = await getOriginalContent(file);

  const modifiedContent = await getModifiedContent(file);

  const stagedContent = await getStagedContent(file);

  return { original: originalContent, modified: modifiedContent, staged: stagedContent };
};

/**
 * Получает подробные изменения для измененных файлов.
 *
 * @param changedFiles - Массив путей к измененным файлам.
 * @returns-  Map с путями к файлам и их содержимым в трех состояниях (оригинальное, измененное и добавленное в staging).
 */
export const getChangedFilesDetails = async (changedFiles: string[]) => {
  const result = new Map<string, { original: string | null; modified: string | null; staged: string | null }>();

  for (const file of changedFiles) {
    const content = await getFileContents(file);

    result.set(file, content);
  }

  return result;
};

/**
 * Получает содержимое измененных файлов, основываясь на релевантных изменениях в JSON-формате.
 *
 * @returns - Пути к файлам и их содержимым в трех состояниях (оригинальное, измененное и добавленное в staging).
 */
export const getChangedContents = async () => {
  const relevantChanges = await getRelevantJsonChanges();

  return getChangedFilesDetails(relevantChanges);
};

/**
 * Получает содержимое файлов на основе их путей.
 *
 * @param content - Содержимое файла в трех состояниях.
 * @returns - Содержимое файла в трех состояниях, преобразованное в объекты JavaScript.
 */
export const getParsedContent = async (content: Content) => {
  try {
    return {
      original: content.original ? JSON.parse(content.original) : null,
      modified: content.modified ? JSON.parse(content.modified) : null,
      staged: content.staged ? JSON.parse(content.staged) : null,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Ошибка парсинга JSON: ${error.message}`);
    }
  }
};

/**
 * Создает модели на основе изменений в файлах.
 *
 * @param changes - Изменения в файлах.
 * @returns - Модели на основе изменений.
 */
export const createModels = async (changes: Map<string, Content>) => {
  const result = new Map<string, { original: StrapiModel; modified: StrapiModel; staged: StrapiModel }>();

  for (const [file, content] of changes.entries()) {
    const parsedContent = await getParsedContent(content);

    if (parsedContent) {
      result.set(file, parsedContent);
    }
  }

  return result;
};

/**
 * Получает модели на основе изменений в файлах.
 *
 * @returns - Модели на основе изменений.
 */
export const getModels = async () => {
  const filesContents = await getChangedContents();

  return createModels(filesContents);
};

/**
 * Получает ключи атрибутов для моделей.
 *
 * @param models - Модели.
 *
 * @returns - Ключи атрибутов для моделей.
 */
export const getAttributesKeys = ({ modified, original, staged }: Models) => {
  return {
    original: Object.keys(original.attributes),
    modified: Object.keys(modified.attributes),
    staged: Object.keys(staged.attributes),
  };
};

/**
 * Получает компоненты для динамических зон в атрибутах.
 *
 * @param attributes - Атрибуты.
 *
 * @returns - Компоненты для динамических зон.
 */
export const getDynamicZoneComponents = (attributes: Record<string, StrapiAttribute>) => {
  const result = new Map<string, string[]>();

  for (const [key, attribute] of Object.entries(attributes)) {
    if (attribute.type === 'dynamiczone') {
      result.set(key, attribute.components);
    }
  }

  return result;
};

/**
 * Получает измененные динамические зоны в моделях.
 *
 * @param models - Модели.
 *
 * @returns - Измененные динамические зоны.
 */
export const getChangedDynamicZones = ({ modified, original, staged }: Models) => {
  return {
    original: getDynamicZoneComponents(original.attributes),
    modified: getDynamicZoneComponents(modified.attributes),
    staged: getDynamicZoneComponents(staged.attributes),
  };
};

/**
 * Сравнивает компоненты в моделях.
 *
 * @param originalComponents - Компоненты оригинальной модели.
 * @param comparedComponents - Сравниваемые компоненты.
 *
 * @returns - Удаленные компоненты.
 */
export const compareComponents = (
  originalComponents: string[],
  comparedComponents: string[] | undefined,
): Set<string> => {
  const removed = new Set<string>();

  if (comparedComponents) {
    originalComponents.forEach((field) => {
      if (!comparedComponents.includes(field)) {
        removed.add(field);
      }
    });
  }

  return removed;
};

/**
 * Получает удаленные компоненты из моделей.
 *
 * @param model - Модели.
 *
 * @returns - Удаленные компоненты.
 */
export const getRemovedComponents = (model: Models) => {
  const result = new Map<string, string[]>();

  const components = getChangedDynamicZones(model);

  // Проходим по каждому dynamiczone компоненту из original
  for (const [key, originalComponents] of components.original) {
    let removed = new Set<string>();

    // Сравниваем с modified
    removed = new Set([...removed, ...compareComponents(originalComponents, components.modified.get(key))]);

    // Сравниваем с staged
    removed = new Set([...removed, ...compareComponents(originalComponents, components.staged.get(key))]);

    if (removed.size > 0) {
      result.set(key, Array.from(removed));
    }
  }

  return result;
};

/**
 * Получает удаленные поля из моделей по ключам.
 *
 * @param keys - Ключи для сравнения.
 *
 * @returns - Удаленные компоненты.
 */
export const getRemovedFieldsByKeys = (keys: { original: string[]; modified: string[]; staged: string[] }) => {
  // Фильтруем оригинальные поля, удаляя те, которые находятся в ignoredFields
  const modelAttributes = keys.original.filter((field) => !ignoredFields.includes(field));

  const modifiedSet = new Set(keys.modified);
  const stagedSet = new Set(keys.staged);

  const removedFields = modelAttributes.filter((field) => !modifiedSet.has(field) && !stagedSet.has(field));

  return removedFields;
};

/**
 * Получает удаленные компоненты из модели.
 *
 * @param model - Модель для сравнения.
 *
 * @returns - Удаленные компоненты.
 */
export const getRemovedFields = (model: Models) => {
  const attributesKeys = getAttributesKeys(model);

  const removedFields = getRemovedFieldsByKeys(attributesKeys);

  return removedFields;
};

/**
 * Получает удаленные поля из моделей.
 *
 * @returns - Удаленные поля.
 */
export const getRemovedFromModels = async () => {
  const models = await getModels();
  const fields = new Map<string, string[]>();
  const components = new Map<string, Map<string, string[]>>();

  for (const [modelFile, model] of models.entries()) {
    const removedFields = getRemovedFields(model);
    const removedComponents = getRemovedComponents(model);

    fields.set(modelFile, removedFields);
    components.set(modelFile, removedComponents);
  }

  return { fields, components };
};
