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
