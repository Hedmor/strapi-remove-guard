import { DEFAULT_TARGET_BRANCH } from './constants';

/**
 * Получает ветку, на которой нужно искать изменения.
 * Если переменная окружения TARGET_BRANCH не установлена,
 * то используется значение по умолчанию DEFAULT_TARGET_BRANCH.
 *
 * @returns - Имя ветки для поиска изменений.
 */
export const getTargetBranch = (): string => process.env.TARGET_BRANCH ?? DEFAULT_TARGET_BRANCH;
