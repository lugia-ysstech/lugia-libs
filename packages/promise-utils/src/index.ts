/**
 * Copyright (c) 2018-present, YSSTech, Inc.
 *
 * @emails lugia@ysstech.com
 * @author zenjava
 */
export type ResolveFunction<PromiseResultType> = (
  value?: PromiseLike<PromiseResultType> | PromiseResultType,
) => void;

export type RejectFunction = (reason?: any) => void;
export function createAsyncPromise<PromiseResultType>(
  cb: (
    resolve: ResolveFunction<PromiseResultType>,
    reject: RejectFunction,
  ) => void,
): Promise<PromiseResultType> {
  return new Promise<PromiseResultType>(async (resolve, reject) => {
    try {
      await cb(resolve, reject);
    } catch (error) {
      console.error(`Promise error: ${error}`);
      reject(error);
    }
  });
}

export interface TimeOutOption {
  timeout?: number;
  title?: string;
}

export function delayResult<T>(val: T, timeout: number): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(val);
    }, timeout);
  });
}

const DefaultTimeOut = 30 * 1000;

export async function execTimeout<T>(
  cb: () => Promise<T>,
  option: TimeOutOption = { timeout: DefaultTimeOut },
): Promise<T | undefined> {
  const { timeout = DefaultTimeOut } = option;

  const timeoutPromise: Promise<any> = new Promise((_, reject) => {
    setTimeout(() => {
      const { title = '方法执行超时' } = option;
      reject(title);
    }, timeout);
  });

  const cbPromise = cb();
  return Promise.race([cbPromise, timeoutPromise]);
}
