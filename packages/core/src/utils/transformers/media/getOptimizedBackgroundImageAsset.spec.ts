import { beforeEach, describe, it, expect } from 'vitest';
import { getOptimizedBackgroundImageAsset } from './getOptimizedBackgroundImageAsset';
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

  it('when width of container is not provided and image is larger than the max width, should return a srcSet with a basis width of 2000px', () => {
    file.details.image!.width = 4000;
    const result = getOptimizedBackgroundImageAsset(file, '');
    expect(result.srcSet).toEqual([
      `url(https:${file.url}?w=2000) 1x`,
      `url(https:${file.url}?w=4000) 2x`,
    ]);
  });

  it('when width of container is not provided and image is larger than the max width, should return a url with a width of 4000px', () => {
    file.details.image!.width = 4000;
    const result = getOptimizedBackgroundImageAsset(file, '');
    expect(result.url).toEqual('https://images.contentful.com/abc/123/a1b2c3/myImage.jpg?w=4000');
  });

  it('when width of container is not provided and the image is smaller than the max width, should return a srcSet with a basis width of the image width, and 2x at same width', () => {
    file.details.image!.width = 1000;
    const result = getOptimizedBackgroundImageAsset(file, '');
    expect(result.srcSet).toEqual([
      `url(https:${file.url}?w=1000) 1x`,
      `url(https:${file.url}?w=1000) 2x`,
    ]);
  });

  it('when width of container is not provided and the image is smaller than the max width, should return a url with a width of the image', () => {
    file.details.image!.width = 1000;
    const result = getOptimizedBackgroundImageAsset(file, '');
    expect(result.url).toEqual('https://images.contentful.com/abc/123/a1b2c3/myImage.jpg?w=1000');
  });

  it('when width of container is 1000px and image is larger than the max width, should return a srcSet with a basis width of 1000px', () => {
    file.details.image!.width = 4000;
    const result = getOptimizedBackgroundImageAsset(file, '1000px');
    expect(result.srcSet).toEqual([
      `url(https:${file.url}?w=1000) 1x`,
      `url(https:${file.url}?w=2000) 2x`,
    ]);
  });

  it('when width of container is 1000px and image is larger than the max width, should return a url with a width of 2x the provided width', () => {
    file.details.image!.width = 4000;
    const result = getOptimizedBackgroundImageAsset(file, '1000px');
    expect(result.url).toEqual('https://images.contentful.com/abc/123/a1b2c3/myImage.jpg?w=2000');
  });

  it('when width of container is 1000px and image is smaller than the max width, should return a srcSet with a basis width of the image width, and 2x at same width', () => {
    file.details.image!.width = 1000;
    const result = getOptimizedBackgroundImageAsset(file, '1000px');
    expect(result.srcSet).toEqual([
      `url(https:${file.url}?w=1000) 1x`,
      `url(https:${file.url}?w=1000) 2x`,
    ]);
  });

  it('when quality is 0%, should return urls without quality', () => {
    file.details.image!.width = 4000;
    const result = getOptimizedBackgroundImageAsset(file, '', '0%');
    expect(result.srcSet).toEqual([
      `url(https:${file.url}?w=2000) 1x`,
      `url(https:${file.url}?w=4000) 2x`,
    ]);
  });

  it('when quality is 100%, should return urls without quality', () => {
    file.details.image!.width = 4000;
    const result = getOptimizedBackgroundImageAsset(file, '', '100%');
    expect(result.srcSet).toEqual([
      `url(https:${file.url}?w=2000) 1x`,
      `url(https:${file.url}?w=4000) 2x`,
    ]);
  });

  it('when quality is provided, should return urls with quality', () => {
    file.details.image!.width = 4000;
    const result = getOptimizedBackgroundImageAsset(file, '', '80%');
    expect(result.srcSet).toEqual([
      `url(https:${file.url}?w=2000&q=80) 1x`,
      `url(https:${file.url}?w=4000&q=80) 2x`,
    ]);
  });

  it('when format is provided, should return urls with format', () => {
    file.details.image!.width = 4000;
    const result = getOptimizedBackgroundImageAsset(file, '', '80%', 'webp');
    expect(result.srcSet).toEqual([
      `url(https:${file.url}?w=2000&q=80&fm=webp) 1x`,
      `url(https:${file.url}?w=4000&q=80&fm=webp) 2x`,
    ]);
  });
});
