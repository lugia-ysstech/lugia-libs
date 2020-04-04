// @flow

import { getStateTypes } from '../../../src/extractor/themeprops/common';

describe('theme-css-hoc/extractor/themeprops/common', () => {
  it('getStateTypes', () => {
    expect(
      getStateTypes({
        hover: false,
        active: false,
        focus: false,
        disabled: false,
      }),
    ).toEqual(['normal']);

    expect(
      getStateTypes({
        hover: true,
        active: true,
        focus: true,
        disabled: true,
      }),
    ).toEqual(['normal', 'hover', 'focus', 'active', 'disabled']);
  });
});
