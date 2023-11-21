import config from './rollup.config.mjs';
import serve from 'rollup-plugin-serve';

config[0].plugins.push(
  serve({
    port: 3333,
    contentBase: ['dist'],
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
);

export default config;
