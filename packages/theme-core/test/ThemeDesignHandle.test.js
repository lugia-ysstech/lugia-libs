/**
 *
 * create by wcx
 *
 * @flow
 */
import 'jest-styled-components';
import ThemeDesignHandle from '../src/ThemeDesignHandle';

const {
  mockObject,
  VerifyOrder,
  VerifyOrderConfig,
} = require('@lugia/jverify');
describe('ThemeHandle.test.js', () => {
  it('packNotInPartObject for css hoc', () => {
    const handle = new ThemeDesignHandle('111');
    const res = handle.packNotInPartObject({
      a: {
        normal: {
          color: 'red',
        },
      },
      b: {
        normal: {
          color: 'blue',
        },
      },
      'a.b.d.e': {
        normal: {
          background: {
            color: 'red',
          },
        },
      },
      'a.b.d.g': {
        normal: {
          background: {
            size: 'large',
          },
        },
      },
    });
    expect(res).toEqual({
      normal: {
        background: {
          color: 'red',
          size: 'large',
        },
      },
    });
  });

  it('getHocTarget for css hoc', () => {
    const handle = new ThemeDesignHandle('111');
    const target = {
      a: {
        normal: {
          color: 'red',
        },
      },
      b: {
        normal: {
          color: 'blue',
        },
      },
      'a.b.d.e': {
        normal: {
          background: {
            color: 'red',
          },
        },
      },
      'a.b.d.g': {
        normal: {
          background: {
            size: 'large',
          },
        },
      },
    };
    const res = handle.getHocTarget(target);
    expect(res).toEqual([]);
  });

  it('getHocTarget for hoc ab abc', () => {
    const handle = new ThemeDesignHandle('111');
    const target = {
      'a.b': {},
      'a.b.partA': {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      'a.b.partB': {
        normal: {
          background: {
            size: 'large',
          },
          color: 'red',
        },
      },

      'a.b.c': {},
      'a.b.c.partA': {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      'a.b.c.partB': {
        normal: {
          background: {
            image: 'bg1',
          },
          color: 'black',
        },
      },
      'a.b.c.partC': {
        normal: {
          background: {
            size: 'small',
          },
          color: 'purple',
        },
      },
    };
    const res = handle.getHocTarget(target);
    expect(res).toEqual([
      { name: 'partA', values: ['a.b.partA', 'a.b.c.partA'] },
      { name: 'partB', values: ['a.b.partB', 'a.b.c.partB'] },
      { name: 'partC', values: ['a.b.c.partC'] },
    ]);
  });
  it('getHocTarget for hoc ab abc abd', () => {
    const handle = new ThemeDesignHandle('111');
    const res = handle.getHocTarget({
      'a.b': {},
      'a.b.d': {},
      'a.b.d.partA': {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      'a.b.d.partB': {
        normal: {
          background: {
            size: 'large',
          },
          color: 'red',
        },
      },

      'a.b.c': {},
      'a.b.c.partA': {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      'a.b.c.partB': {
        normal: {
          background: {
            image: 'bg1',
          },
          color: 'black',
        },
      },
      'a.b.c.partC': {
        normal: {
          background: {
            size: 'small',
          },
          color: 'purple',
        },
      },
    });
    expect(res).toEqual([]);
  });

  it('getHocTarget for hoc ab abc abd abe', () => {
    const handle = new ThemeDesignHandle('111');
    const res = handle.getHocTarget({
      'a.b': {},
      'a.b.d': {},
      'a.b.d.partA': {
        normal: {},
      },
      'a.b.d.partB': {
        normal: {},
      },
      'a.b.c': {},
      'a.b.c.partA': {
        normal: {},
      },
      'a.b.c.partB': {
        normal: {},
      },
      'a.b.c.partC': {
        normal: {},
      },
      'a.b.e': {},
      'a.b.e.partA': {
        normal: {},
      },
      'a.b.e.partB': {
        normal: {},
      },
      'a.b.e.partC': {
        normal: {},
      },
    });
    expect(res).toEqual([]);
  });

  it('getHocTarget for hoc a ab abc abd abe', () => {
    const handle = new ThemeDesignHandle('111');
    const res = handle.getHocTarget({
      a: {},
      'a.b': {},
      'a.b.d': {},
      'a.b.d.partA': {
        normal: {},
      },
      'a.b.d.partB': {
        normal: {},
      },
      'a.b.c': {},
      'a.b.c.partA': {
        normal: {},
      },
      'a.b.c.partB': {
        normal: {},
      },
      'a.b.c.partC': {
        normal: {},
      },
      'a.b.e': {},
      'a.b.e.partA': {
        normal: {},
      },
      'a.b.e.partB': {
        normal: {},
      },
      'a.b.e.partC': {
        normal: {},
      },
    });
    expect(res).toEqual([]);
  });

  it('packNotInPartObject for hoc ab abc', () => {
    const handle = new ThemeDesignHandle('111');
    const res = handle.packNotInPartObject({
      'a.b': {},
      'a.b.partA': {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      'a.b.partB': {
        normal: {
          background: {
            size: 'large',
          },
          color: 'red',
        },
      },

      'a.b.c': {},
      'a.b.c.partA': {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      'a.b.c.partB': {
        normal: {
          background: {
            image: 'bg1',
          },
          color: 'black',
        },
      },
      'a.b.c.partC': {
        normal: {
          background: {
            size: 'small',
          },
          color: 'purple',
        },
      },
    });
    expect(res).toEqual({
      partA: {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      partB: {
        normal: {
          background: {
            size: 'large',
            image: 'bg1',
          },
        },
      },
      partC: {
        normal: {
          background: {
            size: 'small',
          },
          color: 'purple',
        },
      },
    });
  });
  it('packNotInPartObject for hoc ab abc abd', () => {
    const handle = new ThemeDesignHandle('111');
    const res = handle.packNotInPartObject({
      'a.b': {},
      'a.b.d': {},
      'a.b.d.partA': {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      'a.b.d.partB': {
        normal: {
          background: {
            size: 'large',
          },
          color: 'red',
        },
      },

      'a.b.c': {},
      'a.b.c.partA': {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      'a.b.c.partB': {
        normal: {
          background: {
            image: 'bg1',
          },
          color: 'black',
        },
      },
      'a.b.c.partC': {
        normal: {
          background: {
            size: 'small',
          },
          color: 'purple',
        },
      },
    });
    expect(res).toEqual({
      d: {
        partA: {
          normal: {
            background: {
              color: 'red',
            },
            color: 'blue',
          },
        },
        partB: {
          normal: {
            background: {
              size: 'large',
            },
            color: 'red',
          },
        },
      },
      c: {
        partA: {
          normal: {
            background: {
              color: 'red',
            },
            color: 'blue',
          },
        },
        partB: {
          normal: {
            background: {
              image: 'bg1',
            },
            color: 'black',
          },
        },
        partC: {
          normal: {
            background: {
              size: 'small',
            },
            color: 'purple',
          },
        },
      },
    });
  });
});
