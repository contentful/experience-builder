# Welcome!

This repository represents a set of packages, related to the [Experiences](https://www.contentful.com/developers/docs/experiences/what-are-experiences/) product.

## Documentation Links
- [Home](https://www.contentful.com/developers/docs/experiences/)
- [What are Experiences?](https://www.contentful.com/developers/docs/experiences/what-are-experiences/)
- [Set up Experiences SDK](https://www.contentful.com/developers/docs/experiences/set-up-experiences-sdk/)
- [Register custom components](https://www.contentful.com/developers/docs/experiences/register-custom-components/)
- [Component definition schema](https://www.contentful.com/developers/docs/experiences/component-definition-schema/)
- [Built-in styles](https://www.contentful.com/developers/docs/experiences/built-in-styles/)
- [Design tokens](https://www.contentful.com/developers/docs/experiences/design-tokens/)
- [Data structures](https://www.contentful.com/developers/docs/experiences/data-structures/)
- [Error handling](https://www.contentful.com/developers/docs/experiences/error-handling/)
- [Image optimzation](https://www.contentful.com/developers/docs/experiences/image-optimization/)
- [Experiences with NextJS](https://www.contentful.com/developers/docs/experiences/using-with-nextjs/)

## Links to packages in this repo
- [Components](https://github.com/contentful/experience-builder/tree/main/packages/components)
- [Core](https://github.com/contentful/experience-builder/tree/main/packages/core)
- [Experiences CLI tool](https://github.com/contentful/experience-builder/tree/main/packages/create-experience-builder)
- [Experiences SDK](https://github.com/contentful/experience-builder/tree/main/packages/experience-builder-sdk)
- [Test-app](https://github.com/contentful/experience-builder/tree/main/packages/test-app)
- [Validators](https://github.com/contentful/experience-builder/tree/main/packages/validators)
- [Visual-editor](https://github.com/contentful/experience-builder/tree/main/packages/visual-editor)

## Local development
Each package has a `dev` script that will build the application and watch for changes. Running `npm run dev` in the root directory of each package will have the benefit of hot-reloading changes. Doing so comes at the cost of having more terminal windows depending on how many packages you are running. Therefore, if a more concise terminal windowed experience is preferred, run `npm run build` at the project repo root level after every change at the cost of hot-reloading benefits.

Additionally, there is a provided `test-app` package on your behalf to get you quickly started. This package handles fetching the experience and should be displayed in the experience canvas once you set up your enablements, space, and experience type in the Contentful web app.

**If you are looking to use the `test-app`, follow the steps below:**

1. Set up your enablements, space, and experience type through the Contentful web app. At this point, your experience canvas in the UI should display some error state such as `localhost refused to connect`.
2. Then in the `test-app` package open up the `local.env` file and make sure to fill out the following variables
```
VITE_CTFL_ENVIRONMENT=
VITE_CTFL_SPACE=
VITE_CTFL_ACCESS_TOKEN=
VITE_CTFL_PREVIEW_ACCESS_TOKEN=
VITE_CTFL_DOMAIN=contentful.com
VITE_CTFL_EXPERIENCE_TYPE=
```
3. Go to the root directory of the repo and run `npm i` and `npm run build`
4. cd into the `test-app` directory and run `npm run dev`
5. Go back into the Contentful Experiences UI and refresh. You should see your canvas in a happy state where you can now start adding components onto the canvas.

If you are having issues getting the test-app to show up in the canvas checkout the Troubleshooting section below.

## Branching & release process

For each new feature, bug fix, or improvement, create a new branch based off `development` to do your work in. When ready, open up a PR to `development`, and once approved, merge it using the "Squash and merge" option. If the feature branch was a long lived branch, you might decide to do a "Create a merge commit" instead to maintain the history of the feature branch. However, try to avoid having meaningless commits in the feature branch as that will make the overall history of the repository hard to follow.

When a PR is merged into `development`, the CI/CD pipeline will automatically publish a new development package under the `dev` tag.

As the features/fixes in the `development` branch get ready to release, open a PR from `development` into `next`. Once approved, merge it using the "Create a merge commit" option, and have the description of the PR and the subsequent commit be "Release@next".

When a PR is merged into `next`, the CI/CD pipeline will automatically publish a new package under the `beta` tag. Any changes made by the release process to the `next` branch will automatically be merged back into `development`.

To release a stable build, open a PR from `next` into `main`. Once approved, merge it using the "Create a merge commit" option, and have the description of the PR and the subsequent commit be "Release@main".

When a PR is merged into `main`, the CI/CD pipeline will automatically publish a new package under the `latest` tag. Any changes made by the release process to the `main` branch will automatically be merged back into `next` and `development`.

To fix a critical bug that is in `main`, branch of the `main` branch. When your work is complete open a PR against `main`, and when it is approved, merge it back into `main` using the "Squash and merge" option. The change will be automatically merged back into `next` and `development`. However, if there is a merge conflict doing so, you will have to resolve it manually.

### "Prerelease" packages

An option exists for developers to publish specific feature branches as an installable "prerelease" version for testing purposes. This option is presented when [manually triggering the main workflow](https://github.com/contentful/experience-builder/actions/workflows/main.yml). If the "Publish prerelease version of the selected branch" checkbox is selected, a package version for that work-in-progress feature branch will be published to the public NPM repository.

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for our commit messages. This allows us to automatically generate changelogs and version bumps based on the commit messages. Please take care in your commit messages that make it into the main branches (`development`, `next`, and `main`) to follow this specification, as it helps with the release process.

## Troubleshooting

> If your `test-app` is not being displayed in the Contentful Experience UI, double check your environment variables and make sure the values are correct. Additionally, double check your `Content preview settings` and ensure that you are pointing to the correct url which should be `http://localhost:5173`.

> If your `build` command is stuck and not finishing, try resetting the cache via `npx nx reset`
