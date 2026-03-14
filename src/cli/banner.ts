import chalk from 'chalk';
import { APP_NAME } from '../config/constants.js';

export const printBanner = (): void => {
  // eslint-disable-next-line no-console
  console.log(chalk.cyan.bold(`\n${APP_NAME}`));
  // eslint-disable-next-line no-console
  console.log(chalk.gray('CLI autonomous bot | conservative mode for tiny capital\n'));
};
