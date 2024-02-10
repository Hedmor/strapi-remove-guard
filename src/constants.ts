// Ветка с которой будет производиться сравнение.
export const DEFAULT_TARGET_BRANCH = 'develop';

/**
 * Игнорируемые поля при сравнении моделей.
 *
 * Эти поля не создаются пользователем, они обрабатываются автоматически Strapi, и не должны учитываться.
 */
export const ignoredFields = [
  'createdAt',
  'updatedAt',
  'publishedAt',
  'createdBy',
  'updatedBy',
  'localizations',
  'locale',
];
