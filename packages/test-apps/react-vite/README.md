# Experiences Vite Test App

This apps intended purpose is to quickly test the functionality of Studio Experiences when developing locally. There is also a deployed instance of the app that can be used to test Experiences in production.

## How to Start

1. Create a `.env` in this package with the environment variables described in chapter [Config](#config).
2. Make sure that the preview URL of the experience type is set to `http://localhost:5173/{entry.fields.slug}`.
3. Run `npm run dev`.

> [!WARNING]
> Please note that changes in `visual-editor` will only be reflected at runtime if the `experiences-sdk-react` is rebuilt as well as it lazy loads this dependency.

## Config

The app reads several environment variables to configure its behavior:

```
VITE_CTFL_ENVIRONMENT=<environment>
VITE_CTFL_SPACE=<space>
VITE_CTFL_ACCESS_TOKEN=<access token>
VITE_CTFL_PREVIEW_ACCESS_TOKEN=<preview access token>
VITE_CTFL_EXPERIENCE_TYPE=<experience type>
VITE_CTFL_DOMAIN=<domain> (contentful.com (prod) or flinkly.com (staging))
```

## Modifying Config at Runtime

The app stores its configuration (originally read from the env vars above) in local storage in a value called `contentful-configs`. The value is a json string that can be used to configure the app to use a different space, domain, etc.. You can also configure multiple config values in the json as the key is the name of the env to use. The current configuration to use is in the local storage value `contentful-current-config`.

For now, it is a manual process of copying out the json from local storage, editing it, pasting it back into local storage, the refreshing the app. We might provide a UI in the test app to manage this in the future.

There is also a `contentful-is-preview` value in local storage that can be used to put the test app in preview mode.
