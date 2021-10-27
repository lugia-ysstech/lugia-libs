/**
 * Copyright (c) 2018-present, YSSTech, Inc.
 *
 * @emails lugia@ysstech.com
 * @author zenjava
 */
import { createAsyncPromise, delayResult, execTimeout } from '../src';

describe('Promise', () => {
  it('createAsyncPromise resolve ', async () => {
    expect(
      await createAsyncPromise(async (resolve, reject) => {
        resolve(100);
      }),
    ).toEqual(100);
  });

  it('createAsyncPromise reject  ', async () => {
    try {
      await createAsyncPromise(async (resolve, reject) => {
        reject('Is Error');
      });
    } catch (error) {
      expect(error).toEqual('Is Error');
      return;
    }
    throw new Error('Not catch Error');
  });

  it('createAsyncPromise inner throw Error  ', async () => {
    try {
      await createAsyncPromise(async (resolve, reject) => {
        throw new Error('Is Error');
      });
    } catch (error) {
      expect(error.message).toEqual('Is Error');
      return;
    }
    throw new Error('Not catch Error');
  });

  it('execTimeout', async () => {
    expect(await execTimeout(async () => 100)).toEqual(100);

    try {
      await execTimeout(async () => delayResult(0, 500), { timeout: 1 });
    } catch (err) {
      expect(err).toEqual('方法执行超时');
      return;
    }
    throw new Error('未捕获超时异常');
  });

  it('execTimeout title: 解压超时', async () => {
    expect(await execTimeout(async () => 100)).toEqual(100);
    const title = '解压超时';

    try {
      await execTimeout(async () => delayResult(0, 500), { timeout: 1, title });
    } catch (err) {
      expect(err).toEqual(title);
      return;
    }
    throw new Error('未捕获超时异常');
  });
});
