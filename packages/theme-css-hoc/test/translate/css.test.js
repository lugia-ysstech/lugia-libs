// @flow

import {
  getBorderRadius,
  getBorderStyleFromTheme,
  getFont,
  getNumberStyleFromTheme,
  getPosition,
  getSelectNameThemeMeta,
  getSizeFromTheme,
  getBackGround,
  getSpaceFromTheme,
  getStringStyleFromTheme,
  setObjectValueIfValueExist,
} from '../../src/translate/css';

const emptyObj = {};
describe('theme-css-hoc/translate/css', () => {
  it('getThemeByConfig', () => {});

  it('getSelectNameThemeMeta selectNames =[]', () => {
    expect(
      getSelectNameThemeMeta(
        {
          a: 1,
          b: 2,
        },
        [],
      ),
    ).toEqual({});
  });
  it('getSelectNameThemeMeta selectNames 不填', () => {
    expect(
      getSelectNameThemeMeta({
        a: 1,
        b: 2,
      }),
    ).toEqual({ a: 1, b: 2 });
  });

  it('getSpaceFromTheme margin', () => {
    expect(getSpaceFromTheme('margin', 5)).toEqual({
      marginLeft: '0.5rem',
      marginTop: '0.5rem',
      marginRight: '0.5rem',
      marginBottom: '0.5rem',
    });
    expect(getSpaceFromTheme('margin', {})).toEqual({
      marginLeft: '0rem',
      marginTop: '0rem',
      marginRight: '0rem',
      marginBottom: '0rem',
    });
    const space: Object = undefined;
    expect(getSpaceFromTheme('margin', space)).toEqual({});
    expect(
      getSpaceFromTheme('margin', {
        left: 5,
      }),
    ).toEqual({
      marginLeft: '0.5rem',
      marginTop: '0rem',
      marginRight: '0rem',
      marginBottom: '0rem',
    });

    expect(
      getSpaceFromTheme('margin', {
        left: 5,
        top: 'a',
      }),
    ).toEqual({
      marginLeft: '0.5rem',
      marginTop: 'a',
      marginRight: '0rem',
      marginBottom: '0rem',
    });
    expect(
      getSpaceFromTheme('margin', {
        left: 5,
        top: 'a',
        right: 15,
      }),
    ).toEqual({
      marginLeft: '0.5rem',
      marginTop: 'a',
      marginRight: '1.5rem',
      marginBottom: '0rem',
    });
  });
  it('getSpaceFromTheme padding', () => {
    expect(getSpaceFromTheme('padding', 5)).toEqual({
      paddingLeft: '0.5rem',
      paddingTop: '0.5rem',
      paddingRight: '0.5rem',
      paddingBottom: '0.5rem',
    });
    expect(getSpaceFromTheme('padding', {})).toEqual({
      paddingLeft: '0rem',
      paddingTop: '0rem',
      paddingRight: '0rem',
      paddingBottom: '0rem',
    });
    const space: Object = undefined;
    expect(getSpaceFromTheme('padding', space)).toEqual({});
    expect(
      getSpaceFromTheme('padding', {
        left: 5,
      }),
    ).toEqual({
      paddingLeft: '0.5rem',
      paddingTop: '0rem',
      paddingRight: '0rem',
      paddingBottom: '0rem',
    });

    expect(
      getSpaceFromTheme('padding', {
        left: 5,
        top: 'a',
      }),
    ).toEqual({
      paddingLeft: '0.5rem',
      paddingTop: 'a',
      paddingRight: '0rem',
      paddingBottom: '0rem',
    });
    expect(
      getSpaceFromTheme('padding', {
        left: 5,
        top: 'a',
        right: 15,
      }),
    ).toEqual({
      paddingLeft: '0.5rem',
      paddingTop: 'a',
      paddingRight: '1.5rem',
      paddingBottom: '0rem',
    });
  });
  it('getSizeFromTheme', () => {
    expect(getSizeFromTheme(5)).toBe('0.5rem');
    expect(getSizeFromTheme(15)).toBe('1.5rem');
    expect(getSizeFromTheme('15')).toBe('1.5rem');
    expect(getSizeFromTheme('50%')).toBe('50%');
  });

  it('setObjectValueIfValueExist', () => {
    let style = {};
    setObjectValueIfValueExist(style, 'lgx', {}, () => 'abc');
    expect(style).toEqual({
      lgx: 'abc',
    });

    style = {};
    setObjectValueIfValueExist(style, 'lgx', null, () => null);
    expect(style).toEqual({});

    style = {};
    setObjectValueIfValueExist(style, 'a', 0);
    expect(style).toEqual({ a: 0 });

    style = {};
    setObjectValueIfValueExist(style, 'b', 1110);
    expect(style).toEqual({ b: 1110 });
  });

  it('getBorderStyleFromTheme for none', () => {
    expect(getBorderStyleFromTheme('none')).toEqual({
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    });

    expect(
      getBorderStyleFromTheme({
        top: {
          style: 'solid',
          color: 'red',
          width: 50,
        },
      }),
    ).toEqual({
      borderTopColor: 'red',
      borderTopWidth: '5rem',
      borderTopStyle: 'solid',
    });
    expect(
      getBorderStyleFromTheme({
        top: {
          style: 'solid',
          color: 'red',
          width: 50,
        },
        right: {
          style: 'fei',
          color: 'green',
          width: 510,
        },
        bottom: {
          style: 'ji',
          color: 'black',
          width: '10%',
        },
        left: {
          style: 'xigua',
          color: 'blue',
          width: '5',
        },
      }),
    ).toEqual({
      borderTopColor: 'red',
      borderTopWidth: '5rem',
      borderTopStyle: 'solid',

      borderRightColor: 'green',
      borderRightWidth: '51rem',
      borderRightStyle: 'fei',

      borderBottomColor: 'black',
      borderBottomWidth: '10%',
      borderBottomStyle: 'ji',

      borderLeftColor: 'blue',
      borderLeftWidth: '0.5rem',
      borderLeftStyle: 'xigua',
    });
    expect(
      getBorderStyleFromTheme({
        top: {
          style: 'solid',
          color: 'red',
          width: 50,
        },
        right: {
          style: 'fei',
          color: 'green',
          width: 510,
        },
        left: {
          style: 'xigua',
          color: 'blue',
          width: '5',
        },
      }),
    ).toEqual({
      borderTopColor: 'red',
      borderTopWidth: '5rem',
      borderTopStyle: 'solid',

      borderRightColor: 'green',
      borderRightWidth: '51rem',
      borderRightStyle: 'fei',

      borderLeftColor: 'blue',
      borderLeftWidth: '0.5rem',
      borderLeftStyle: 'xigua',
    });
    expect(
      getBorderStyleFromTheme({
        top: {
          style: 'solid',
          color: 'red',
          width: 50,
        },
        bottom: {
          style: 'ji',
          color: 'black',
          width: '10%',
        },
        left: {
          style: 'xigua',
          color: 'blue',
          width: '5',
        },
      }),
    ).toEqual({
      borderTopColor: 'red',
      borderTopWidth: '5rem',
      borderTopStyle: 'solid',

      borderBottomColor: 'black',
      borderBottomWidth: '10%',
      borderBottomStyle: 'ji',

      borderLeftColor: 'blue',
      borderLeftWidth: '0.5rem',
      borderLeftStyle: 'xigua',
    });
    expect(getBorderStyleFromTheme(emptyObj)).toEqual({});
  });
  it('getBorderRadius', () => {
    expect(getBorderRadius(emptyObj)).toEqual({});
    expect(
      getBorderRadius({
        topLeft: 10,
        topRight: 20,
        bottomLeft: 30,
        bottomRight: 40,
      }),
    ).toEqual({
      borderTopLeftRadius: '1rem',
      borderTopRightRadius: '2rem',
      borderBottomLeftRadius: '3rem',
      borderBottomRightRadius: '4rem',
    });
  });
  it('getFont', () => {
    expect(getFont(emptyObj)).toEqual({});

    expect(
      getFont({
        size: 15,
        style: 'bold',
        family: 'songti',
        weight: 55,
      }),
    ).toEqual({
      fontSize: '1.5rem',
      fontStyle: 'bold',
      fontFamily: 'songti',
      fontWeight: 55,
    });

    expect(
      getFont({
        size: '15',
        style: 'bold',
        family: 'songti',
        weight: 55,
      }),
    ).toEqual({
      fontSize: '1.5rem',
      fontStyle: 'bold',
      fontFamily: 'songti',
      fontWeight: 55,
    });
    expect(
      getFont({
        size: '10%',
        style: 'bold',
        family: 'songti',
        weight: 55,
      }),
    ).toEqual({
      fontSize: '10%',
      fontStyle: 'bold',
      fontFamily: 'songti',
      fontWeight: 55,
    });

    expect(
      getFont({
        style: 'bold',
        family: 'songti',
        weight: 55,
      }),
    ).toEqual({
      fontStyle: 'bold',
      fontFamily: 'songti',
      fontWeight: 55,
    });
  });

  it('getStringStyleFromTheme', () => {
    expect(getStringStyleFromTheme('')).toBe('');
    expect(getStringStyleFromTheme('abc')).toBe('abc');
    const val: any = 5;
    expect(getStringStyleFromTheme(val)).toBe('');
  });

  it('getNumberStyleFromTheme', () => {
    expect(getNumberStyleFromTheme(15)).toBe(15);
    const val: any = 5;
    expect(getNumberStyleFromTheme(val)).toBe(5);
  });

  it('getPosition', () => {
    expect(
      getPosition({
        left: '15%',
        right: 55,
      }),
    ).toEqual({
      position: 'absolute',
      left: '15%',
      right: '5.5rem',
    });
    expect(
      getPosition({
        left: '15%',
        right: 55,
        bottom: 5,
        top: '25',
      }),
    ).toEqual({
      position: 'absolute',
      left: '15%',
      right: '5.5rem',
      top: '2.5rem',
      bottom: '0.5rem',
    });
  });

  it('getBackGround', () => {
    expect(
      getBackGround({
        color: 'color',
        image: 'image',
        origin: 'origin',
        size: 'size',
        clip: 'clip',
      }),
    ).toEqual({
      backgroundColor: 'color',
      backgroundImage: 'image',
      backgroundOrigin: 'origin',
      backgroundSize: 'size',
      backgroundClip: 'clip',
    });
  });
});
