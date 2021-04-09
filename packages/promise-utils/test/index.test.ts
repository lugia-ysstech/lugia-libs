/**
 * Copyright (c) 2018-present, YSSTech, Inc.
 *
 * @emails lugia@ysstech.com
 * @author zenjava
 */
import { createAsyncPromise } from '../src';

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
});
