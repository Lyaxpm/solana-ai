import chalk from 'chalk';

export const block = (title: string, lines: string[]): string => {
  return `${chalk.bold(title)}\n${lines.map((l) => `  ${l}`).join('\n')}`;
};
