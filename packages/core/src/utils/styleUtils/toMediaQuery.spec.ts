import { toMediaQuery } from './toMediaQuery';

describe('toMediaQuery', () => {
  it('should return css for default breakpoint without wrapping it into a media query', () => {
    const res = toMediaQuery({
      condition: '*',
      cssByClassName: {
        className1: 'background:green;color:white;font-size:1rem;',
        className2: 'background:red;color:black;font-size:1.5rem;',
      },
    });

    expect(res).toBe(
      '.className1{background:green;color:white;font-size:1rem;}.className2{background:red;color:black;font-size:1.5rem;}',
    );
  });

  it('should wrap styles for non default breakpoint into a media query', () => {
    const res = toMediaQuery({
      condition: '<950px',
      cssByClassName: {
        className1: 'background:green;color:white;font-size:1rem;',
        className2: 'background:red;color:black;font-size:1.5rem;',
      },
    });

    expect(res).toBe(
      '@media(max-width:950px){.className1{background:green;color:white;font-size:1rem;}.className2{background:red;color:black;font-size:1.5rem;}}',
    );
  });

  it('should support min-width media query rule', () => {
    const res = toMediaQuery({
      condition: '>950px',
      cssByClassName: {
        className1: 'background:green;color:white;font-size:1rem;',
        className2: 'background:red;color:black;font-size:1.5rem;',
      },
    });

    expect(res).toBe(
      '@media(min-width:950px){.className1{background:green;color:white;font-size:1rem;}.className2{background:red;color:black;font-size:1.5rem;}}',
    );
  });

  describe('when nextCondition is provided', () => {
    const cssByClassName = { className1: 'background:green;' };
    const resultCss = '.className1{background:green;}';

    it('should create a negated media query rule', () => {
      const res = toMediaQuery({
        condition: '*',
        nextCondition: '<950px',
        cssByClassName,
      });
      expect(res).toBe(`@media not (max-width:950px){${resultCss}}`);
    });

    it('should should create a disjunct media query rule with not operator', () => {
      const res = toMediaQuery({
        condition: '<950px',
        nextCondition: '>500px',
        cssByClassName,
      });
      expect(res).toBe(`@media(max-width:950px) and (not (min-width:500px)){${resultCss}}`);
    });
  });
});
