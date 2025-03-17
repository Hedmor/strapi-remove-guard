# EN

## Problem Description

When developing multiple features in parallel in a single Strapi CMS project, situations often arise where changes in data models affect the stability and compatibility of the system. Working in a shared environment can lead to conflicts and application malfunctions, especially when breaking changes occur.

## Solution

The `strapi-remove-guard` package was created to prevent incompatible changes from being made to Strapi data models. It analyzes the current changes in models and components, comparing them with the target branch (default is `develop`), and prevents the removal of fields, ensuring system stability and compatibility during parallel development.

## Installation

The `strapi-remove-guard` package is available for installation via npm. To install it, run the following command:

```bash
npm install strapi-remove-guard
```

## Usage

After installing the package, you can use it to check for changes in data models. Run the following command:

```bash
npm sr-guard --branch <name-branch>
```
where:
    --branch (or -b) — the name of the branch to compare the current changes with. If not specified, the default branch develop will be used.

# RU

## Описание проблемы

При параллельной разработке нескольких функциональных возможностей в одном проекте Strapi CMS часто возникают ситуации, когда изменения в моделях данных влияют на стабильность и совместимость системы. Работа в едином окружении может привести к конфликтам и нарушению работы приложения, особенно при наличии breaking changes.

## Решение

Пакет strapi-remove-guard был разработан для предотвращения внесения несовместимых изменений в модели данных Strapi. Он анализирует текущие изменения в моделях и компонентах, сравнивая их с целевой веткой (по умолчанию develop), и предотвращает удаление полей, что обеспечивает стабильность и совместимость системы при параллельной разработке.

## Установка пакета

Пакет strapi-remove-guard доступен для установки через npm. Для его установки выполните следующую команду:

```bash
npm install strapi-remove-guard
```

## Использование

После установки пакета вы можете использовать его для проверки изменений в моделях данных. Для этого выполните команду:

```bash
npm sr-guard --branch <имя-ветки>
```

где:
    --branch (или -b) — имя ветки, с которой необходимо сравнить текущие изменения. Если не указано, по умолчанию используется ветка develop.
