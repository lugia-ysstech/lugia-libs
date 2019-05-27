/**
 * Created Date: Wednesday, August 29th 2018, 5:02:45 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, May 23rd 2019, 7:58:30 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import { homedir, tmpdir } from 'os';

// cache result
export const homeOrTmp = homedir() || tmpdir();

console.log(homeOrTmp);

export default 'Hello Lerna';
