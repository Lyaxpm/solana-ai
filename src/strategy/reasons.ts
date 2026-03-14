export const pushReason = (arr: string[], pass: boolean, yes: string, no: string): void => {
  arr.push(pass ? yes : no);
};
