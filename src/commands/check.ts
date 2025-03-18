import { ArgumentsCamelCase, Argv } from 'yargs';
import { logger } from '../logger';
import { bold, red } from 'picocolors';
import { getRemovedFromModels } from '../diff-helper';

interface CheckArgv {
  branch: string;
}

export const command = 'check';
export const describe = 'Compares the current changes with the target branch (default is develop).';
export const aliases = ['c'];

export function builder(yargs: Argv<CheckArgv>): Argv {
  return yargs.option('branch', {
    type: 'string',
    alias: 'b',
    default: true,
  });
}

const printComponentsLogs = (
  components: Map<string, Map<string, string[]>>,
  header: string = 'Removed fields from components:',
) => {
  if (components.size > 0) {
    logger.info(red(header));

    for (const [file, removedComponents] of components) {
      logger.info(`${bold(file)}: ${Array.from(removedComponents.values()).join(', ')}`);
    }
  }
};

const printFieldsLogs = (fields: Map<string, string[]>, header: string = 'Removed fields from models:') => {
  if (fields.size > 0) {
    logger.info(red(header));
    for (const [file, removed] of fields) {
      logger.info(`${bold(file)}: ${removed.join(', ')}`);
    }
  }
};

export async function handler(argv: ArgumentsCamelCase<CheckArgv>) {
  const { components, fields } = await getRemovedFromModels();

  if (typeof argv.branch === 'string') {
    logger.info(bold(`Branch check: ${argv.branch}`));

    process.env.TARGET_BRANCH = argv.branch;
  }

  printComponentsLogs(components);
  printFieldsLogs(fields);

  if (components.size > 0 || fields.size > 0) {
    process.exit(1);
  }
}
