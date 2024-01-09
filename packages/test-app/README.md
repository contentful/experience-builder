# EB Test App

This apps intended purpose is to quickly test the functionality of the EB when developing locally. There is also a deployed instance of the app that can be used to test EB in a production.

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
