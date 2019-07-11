/**
 * Created Date: Friday, November 9th 2018, 2:47:20 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Friday, November 9th 2018, 2:49:52 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */
const path = require('path');
export default {
  disableCSSModules: true,
  disableDll: true,
  browserslist: ['>0.2%', 'not dead', 'not ie <= 11', 'not op_mini all'],
  alias: {
    react: path.join(__dirname, '/node_modules/react'),
  },
};
