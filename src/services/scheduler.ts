import { sleep } from '../utils/time.js';

export class Scheduler {
  async waitNext(seconds: number): Promise<void> {
    await sleep(seconds * 1000);
  }
}
