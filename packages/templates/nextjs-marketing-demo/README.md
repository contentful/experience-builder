# Experiences NextJS Marketing Demo

This app is a starter template for Studio Experiences, showcasing an example marketing website.

## How to Start

1. Copy the `.env.template` file to `.env` in this project directory and set the environment variables as described in [Config](#config)
2. Set the content preview URL of the experience type to `http://localhost:3000/{entry.fields.slug}`
3. Run `npm run dev`

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
