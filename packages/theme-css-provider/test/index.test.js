/**
 * Created Date: Friday, September 28th 2018, 3:43:11 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, May 23rd 2019, 6:38:45 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import { existsSync } from 'fs';
import hello, { homeOrTmp } from '../src';

describe('homeOrTmp', () => {
  test('homeOrTmp exists', () => {
    expect(existsSync(homeOrTmp)).toBe(true);
  });

  test('export default', () => {
    expect(hello).toMatchSnapshot();
  });
});
