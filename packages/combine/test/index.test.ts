/**
 *
 * create by ligx
 *
 */
import {
  combineFunction,
  combineMethodObject,
  tillMethodAttribute,
} from '../src';

describe('combine', () => {
  it('combineMethodObject 1', () => {
    const res: string[] = [];
    const eventA = {
      onChange() {
        res.push('changeA');
      },
    };

    const result = combineMethodObject(eventA);
    expect(result).toEqual({ onChange: [eventA.onChange] });
  });

  it('combineMethodObject 2', () => {
    const res: string[] = [];
    const eventA = {
      onChange() {
        res.push('changeA');
      },
    };

    const eventB = {
      onChange(v: any) {
        res.push('changeB' + v);
      },
    };

    const result = combineMethodObject(eventA, eventB);
    expect(result).toEqual({ onChange: [eventA.onChange, eventB.onChange] });
  });

  it('combineMethodObject 3', () => {
    const res: string[] = [];
    const eventA = {
      onChange() {
        res.push('changeA');
      },
      number: 1,
    };

    const eventB = {
      onChange(v: any) {
        res.push('changeB' + v);
      },
    };
    const eventC = {
      onChange(v: any) {
        res.push('changeB' + v);
      },
    };

    const result = combineMethodObject(eventA, eventB, eventC);
    expect(result).toEqual({
      onChange: [eventA.onChange, eventB.onChange, eventC.onChange],
    });
  });

  it('combineMethodObject 3 one different ', () => {
    const res: string[] = [];
    const eventA = {
      onChange() {
        res.push('changeA');
      },
    };

    const eventB = {
      onClick(v: any) {
        res.push('changeB' + v);
      },
    };
    const eventC = {
      onChange(v: any) {
        res.push('changeB' + v);
      },
    };

    const result = combineMethodObject(eventA, eventB, eventC);
    expect(result).toEqual({
      onChange: [eventA.onChange, eventC.onChange],
      onClick: [eventB.onClick],
    });
  });

  it('combineMethodObject 3 all different ', () => {
    const res: string[] = [];

    const eventA = {
      onInput() {
        res.push('changeA');
      },
    };

    const eventB = {
      onClick(v: any) {
        res.push('changeB' + v);
      },
    };
    const eventC = {
      onChange(v: any) {
        res.push('changeB' + v);
      },
    };

    const result = combineMethodObject(eventA, eventB, eventC);
    expect(result).toEqual({
      onInput: [eventA.onInput],
      onChange: [eventC.onChange],
      onClick: [eventB.onClick],
    });
  });

  it('combineMethodObject empty ', () => {
    const result = combineMethodObject();
    expect(result).toEqual({});
  });
  it('combineMethodObject null or undefined ', () => {
    const result = combineMethodObject(null as any, undefined as any);
    expect(result).toEqual({});
  });

  it('tillMethodAttribute', () => {
    const onChange = () => {
      console.info('onChange');
    };
    const onClick = () => {
      console.info('click');
    };
    const expRes = {
      onChange: [onChange],
      onClick: [onClick],
    };
    expect(
      tillMethodAttribute({
        onChange,
        onClick,
        number: 1,
      }),
    ).toEqual(expRes);
  });

  it('tillMethodAttribute empty', () => {
    expect(tillMethodAttribute(null as any)).toEqual({});
    expect(tillMethodAttribute(undefined as any)).toEqual({});
  });

  it('combineFunction 3', () => {
    const res: string[] = [];

    const eventA = {
      onChange(v: any) {
        res.push('changeA' + v);
      },
    };

    const eventB = {
      onChange(v: any) {
        res.push('changeB' + v);
      },
    };
    const eventC = {
      onChange(v: any) {
        res.push('changeC' + v);
      },
    };

    const result = combineFunction({ targets: [eventA, eventB, eventC] });
    result.onChange('hello');
    expect(res).toEqual(['changeAhello', 'changeBhello', 'changeChello']);
  });
  it('combineFunction 3', () => {
    const changeRes: string[] = [];
    const clickRes: string[] = [];
    const eventA = {
      onChange(v: any) {
        changeRes.push('changeA' + v);
      },
    };

    const eventB = {
      onClick(v: any) {
        clickRes.push('onClick' + v);
      },
    };
    const eventC = {
      onChange(v: any) {
        changeRes.push('changeC' + v);
      },
    };

    const result = combineFunction({ targets: [eventA, eventB, eventC] });
    result.onChange('hello');
    expect(changeRes).toEqual(['changeAhello', 'changeChello']);
    result.onClick('clk');
    expect(clickRes).toEqual(['onClickclk']);
  });

  it('combineFunction option return number', () => {
    const changeRes: string[] = [];
    const clickRes: string[] = [];
    const eventA = {
      onChange(v: any) {
        changeRes.push('changeA' + v);
      },
    };

    const eventB = {
      onClick(v: any) {
        clickRes.push('onClick' + v);
      },
    };
    const eventC = {
      onChange(v: any) {
        changeRes.push('changeC' + v);
        return 5;
      },
    };

    const result = combineFunction({
      targets: [eventA, eventB, eventC],
      option: { returned: eventC },
    });
    expect(result.onChange('hello')).toBe(5);
    expect(changeRes).toEqual(['changeAhello', 'changeChello']);
    result.onClick('clk');
    expect(clickRes).toEqual(['onClickclk']);
  });

  it('combineFunction option returned promise', async () => {
    const changeRes: string[] = [];
    const clickRes: string[] = [];
    const eventA = {
      onChange(v: any) {
        changeRes.push('changeA' + v);
        return Promise.resolve(1);
      },
    };

    const eventB = {
      onClick(v: any) {
        clickRes.push('onClick' + v);
        return 3;
      },
    };
    const eventC = {
      onChange(v: any) {
        changeRes.push('changeC' + v);
        return 5;
      },
    };

    const result = combineFunction({
      targets: [eventA, eventB, eventC],
      option: { returned: eventA },
    });
    expect(await result.onChange('hello')).toBe(1);
    expect(changeRes).toEqual(['changeAhello', 'changeChello']);
    result.onClick('clk');
    expect(clickRes).toEqual(['onClickclk']);
  });

  it('combineFunction option func is async', async () => {
    const changeRes: string[] = [];
    const clickRes: string[] = [];
    const eventA = {
      async onChange(v: any) {
        changeRes.push('changeA' + v);
        return 1;
      },
    };

    const eventB = {
      onClick(v: any) {
        clickRes.push('onClick' + v);
        return 3;
      },
    };
    const eventC = {
      async onChange(v: any) {
        changeRes.push('changeC' + v);
        return 5;
      },
    };

    const result = combineFunction({
      targets: [eventA, eventB, eventC],
      option: { returned: eventA },
    });
    expect(await result.onChange('hello')).toBe(1);
    expect(changeRes).toEqual(['changeAhello', 'changeChello']);
    result.onClick('clk');
    expect(clickRes).toEqual(['onClickclk']);
  });
});
