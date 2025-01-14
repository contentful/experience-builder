import { getSelectionNodes } from './sendSelectedComponentCoordinates';
import { vi } from 'vitest';

describe('getSelectionNodes', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('should return the selected node and its parent', () => {
    document.body.innerHTML = `
      <div data-cf-node-id="parent">
        <div data-cf-node-id="child"></div>
      </div>
    `;
    const selection = getSelectionNodes('child');

    const target = document.querySelector('[data-cf-node-id="child"]');
    const parent = document.querySelector('[data-cf-node-id="parent"]');
    const patternChild = null;

    expect(target).toBeDefined();
    expect(parent).toBeDefined();
    expect(selection).toEqual({ target, patternChild, parent });
  });

  it('should return the selected pattern child node and its pattern', () => {
    document.body.innerHTML = `
      <div data-cf-node-id="parent">
        <div data-cf-node-id="pattern" data-cf-node-block-type="assembly">
          <div>
            <div data-cf-node-id="pattern---0_0" data-cf-node-block-type="assemblyBlock"></div>
          </div>
        </div>
      </div>
    `;
    const selection = getSelectionNodes('pattern---0_0');

    const target = document.querySelector('[data-cf-node-id="pattern"]');
    const parent = null;
    const patternChild = document.querySelector('[data-cf-node-id="pattern---0_0"]');

    expect(target).toBeDefined();
    expect(patternChild).toBeDefined();
    expect(selection).toEqual({ target, patternChild, parent });
  });

  it('should return the selected nested pattern child node and its nested pattern', () => {
    document.body.innerHTML = `
      <div data-cf-node-id="parent">
        <div data-cf-node-id="pattern" data-cf-node-block-type="assembly">
          <div data-cf-node-id="pattern---0" data-cf-node-block-type="assemblyBlock">
          <div data-cf-node-id="pattern---1" data-cf-node-block-type="assembly">
            <div data-cf-node-id="pattern---1---0" data-cf-node-block-type="assemblyBlock"></div>
          </div>
        </div>
        </div>
      </div>
    `;
    const selection = getSelectionNodes('pattern---1---0');

    const target = document.querySelector('[data-cf-node-id="pattern---1"]');
    const parent = null;
    const patternChild = document.querySelector('[data-cf-node-id="pattern---1---0"]');

    expect(target).toBeDefined();
    expect(patternChild).toBeDefined();
    expect(selection).toEqual({ target, patternChild, parent });
  });

  it('should return the selected nested pattern with the upper pattern as parent', () => {
    document.body.innerHTML = `
      <div data-cf-node-id="parent">
        <div data-cf-node-id="pattern" data-cf-node-block-type="assembly">
          <div data-cf-node-id="pattern---0" data-cf-node-block-type="assemblyBlock">
          <div data-cf-node-id="pattern---1" data-cf-node-block-type="assembly">
            <div data-cf-node-id="pattern---1---0" data-cf-node-block-type="assemblyBlock"></div>
          </div>
        </div>
        </div>
      </div>
    `;
    const selection = getSelectionNodes('pattern---1');

    const target = document.querySelector('[data-cf-node-id="pattern---1"]');
    const parent = document.querySelector('[data-cf-node-id="pattern"]');
    const patternChild = null;

    expect(target).toBeDefined();
    expect(patternChild).toBeDefined();
    expect(selection).toEqual({ target, patternChild, parent });
  });
});
