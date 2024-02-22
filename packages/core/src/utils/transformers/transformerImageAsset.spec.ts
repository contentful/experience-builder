import { beforeEach, describe, it, expect } from 'vitest';
import { transformImageAsset } from './transformImageAsset';
import { AssetFile } from 'contentful';

let file: AssetFile;

describe('transformImageAsset', () => {
  beforeEach(() => {
    file = {
      url: '//images.contentful.com/abc/123/a1b2c3/myImage.jpg',
      details: { size: 1234567, image: { width: 800, height: 450 } },
      fileName: 'myImage.jpeg',
      contentType: 'image/jpeg',
    };
  });

  it('when width of image is 250, should return a srcSet with 2 parts', () => {
    file.details.image!.width = 250;
    const result = transformImageAsset(file, '500px');
    expect(result.srcSet).toEqual([`${file.url}?w=125 125w`, `${file.url}?w=250 250w`]);
  });

  it('when width of image is 500, should return a srcSet with 2 parts', () => {
    file.details.image!.width = 500;
    const result = transformImageAsset(file, '500px');
    expect(result.srcSet).toEqual([`${file.url}?w=250 250w`, `${file.url}?w=500 500w`]);
  });

  it('when width of image is 525, should return a srcSet with 2 parts', () => {
    file.details.image!.width = 525;
    const result = transformImageAsset(file, '500px');
    expect(result.srcSet).toEqual([`${file.url}?w=263 263w`, `${file.url}?w=525 525w`]);
  });

  it('when width of image is 1000, should return a srcSet with 2 parts', () => {
    file.details.image!.width = 1000;
    const result = transformImageAsset(file, '500px');
    expect(result.srcSet).toEqual([`${file.url}?w=500 500w`, `${file.url}?w=1000 1000w`]);
  });

  it('when width of image is 1500, should return a srcSet with 3 parts', () => {
    file.details.image!.width = 1500;
    const result = transformImageAsset(file, '500px');
    expect(result.srcSet).toEqual([
      `${file.url}?w=500 500w`,
      `${file.url}?w=1000 1000w`,
      `${file.url}?w=1500 1500w`,
    ]);
  });

  it('when width of image is 4000, should return a srcSet with 9 equalish parts', () => {
    file.details.image!.width = 4000;
    const result = transformImageAsset(file, '500px');
    expect(result.srcSet).toEqual([
      `${file.url}?w=500 500w`,
      `${file.url}?w=1000 1000w`,
      `${file.url}?w=1500 1500w`,
      `${file.url}?w=2000 2000w`,
      `${file.url}?w=2500 2500w`,
      `${file.url}?w=3000 3000w`,
      `${file.url}?w=3500 3500w`,
      `${file.url}?w=4000 4000w`,
    ]);
  });

  it('when width of image is over 4000 width, should cap API calls to 4000 width and set the full image as the last in the srcSet', () => {
    file.details.image!.width = 5000;
    const result = transformImageAsset(file, '500px');
    expect(result.srcSet).toEqual([
      `${file.url}?w=500 500w`,
      `${file.url}?w=1000 1000w`,
      `${file.url}?w=1500 1500w`,
      `${file.url}?w=2000 2000w`,
      `${file.url}?w=2500 2500w`,
      `${file.url}?w=3000 3000w`,
      `${file.url}?w=3500 3500w`,
      `${file.url}?w=4000 4000w`,
      `${file.url}? 5000w`,
    ]);
  });

  it('when no sizes is passed, srcSet should be empty', () => {
    const result = transformImageAsset(file);
    expect(result.srcSet).toEqual([]);
  });

  it('the url should have a width limit of 2000 and quality of 80 when the image width is larger than 2000', () => {
    file.details.image!.width = 2500;
    const result = transformImageAsset(file, '500px', 80);
    expect(result.url).toEqual(`${file.url}?w=2000&q=80`);
  });

  it('the url should have no width limit and quality of 80 when the image width is 800', () => {
    const result = transformImageAsset(file, '500px', 80);
    expect(result.url).toEqual(`${file.url}?&q=80`);
  });

  it('when there is no file on the asset, should throw an error', () => {
    file.details.image = undefined;
    expect(() => transformImageAsset(file)).toThrowError('No image in file asset to transform');
  });

  it('when sizes is passed, the sizes should be on the return object', () => {
    const result = transformImageAsset(file, '500px');
    expect(result.sizes).toEqual('500px');
  });

  it('when quality is passed, the quality should be on the srcSet urls', () => {
    const result = transformImageAsset(file, '500px', 50);
    expect(result.srcSet).toEqual([`${file.url}?w=400&q=50 400w`, `${file.url}?w=800&q=50 800w`]);
  });

  it('when quality is 0, the quality should not be on the srcSet urls', () => {
    const result = transformImageAsset(file, '500px', 0);
    expect(result.srcSet).toEqual([`${file.url}?w=400 400w`, `${file.url}?w=800 800w`]);
  });

  it('when quality is 100, the quality should not be on the srcSet urls', () => {
    const result = transformImageAsset(file, '500px', 100);
    expect(result.srcSet).toEqual([`${file.url}?w=400 400w`, `${file.url}?w=800 800w`]);
  });

  it('when quality is less than 0, should throw an error', () => {
    expect(() => transformImageAsset(file, '500px', -1)).toThrowError(
      'Quality must be between 0 and 100',
    );
  });

  it('when quality is more than 100, should throw an error', () => {
    expect(() => transformImageAsset(file, '500px', 101)).toThrowError(
      'Quality must be between 0 and 100',
    );
  });

  it('when format is passed, the format should be on the srcSet urls', () => {
    const result = transformImageAsset(file, '500px', undefined, 'webp');
    expect(result.srcSet).toEqual([
      `${file.url}?w=400&fm=webp 400w`,
      `${file.url}?w=800&fm=webp 800w`,
    ]);
  });

  it('when an invalid format is passed, should throw an error', () => {
    // @ts-expect-error passing an invalid format on purpose yo
    expect(() => transformImageAsset(file, '500px', undefined, 'jpeg')).toThrowError(
      'Format must be one of jpg, png, webp, gif, avif',
    );
  });
});