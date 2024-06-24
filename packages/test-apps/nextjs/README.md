# Experiences NextJS Test App

This apps intended purpose is to quickly test the functionality of Studio Experiences when developing locally.

## How to Start

1. Create a `.env` in this package with the environment variables described in chapter [Config](#config).
2. Make sure that the preview URL of the experience type is set to `http://localhost:5173/{entry.fields.slug}`.
3. Run `npm run dev`.

> [!WARNING]
> Please note that changes in `visual-editor` will only be reflected at runtime if the `experiences-sdk-react` is rebuilt as well as it lazy loads this dependency.

## Config

The app reads several environment variables to configure its behavior:

```
 NEXT_PUBLIC_CTFL_ENVIRONMENT=<environment>
 NEXT_PUBLIC_CTFL_SPACE=<space>
 NEXT_PUBLIC_CTFL_ACCESS_TOKEN=<access token>
 NEXT_PUBLIC_CTFL_PREVIEW_ACCESS_TOKEN=<preview access token>
 NEXT_PUBLIC_CTFL_EXPERIENCE_TYPE=<experience type>
 NEXT_PUBLIC_CTFL_DOMAIN=<domain> (contentful.com (prod) or flinkly.com (staging))
```

### Content Preview URL setup

The content preview URL that points to this app will need a special query param added to it. This param is called `expEditorMode`, and it's used to indicate to the app that it is being loaded in the editor. An example URL using this param could be: "http://localhost:5173?expEditorMode=true"
