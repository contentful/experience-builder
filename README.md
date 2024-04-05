# Welcome!

This repository represents a set of packages, related to the [Studio Experiences](https://www.contentful.com/developers/docs/experiences/what-are-experiences/) product.

## Documentation

Please refer to our [Documentation](https://www.contentful.com/developers/docs/experiences/) to learn more about it.

## Local Development

Each package has a 'dev' script that will build the application and watch for changes.

Run the following command in the directory of the package to start the dev script:

```bash
npm run dev 
```

## Branching & Release Process

For each new feature, bug fix, or improvement, create a new branch based off `development` to do your work in. When ready, open up a PR to `development`, and once approved, merge it using the "Squash and merge" option. If the feature branch was a long lived branch, you might decide to do a "Create a merge commit" instead to maintain the history of the feature branch. However, try to avoid having meaningless commits in the feature branch as that will make the overall history of the repository hard to follow.

When a PR is merged into `development`, the CI/CD pipeline will automatically publish a new development package under the `dev` tag.

As the features/fixes in the `development` branch get ready to release, open a PR from `development` into `next`. Once approved, merge it using the "Create a merge commit" option, and have the description of the PR and the subsequent commit be "Release@next".

When a PR is merged into `next`, the CI/CD pipeline will automatically publish a new package under the `beta` tag. Any changes made by the release process to the `next` branch will automatically be merged back into `development`.

To release a stable build, open a PR from `next` into `main`. Once approved, merge it using the "Create a merge commit" option, and have the description of the PR and the subsequent commit be "Release@main".

When a PR is merged into `main`, the CI/CD pipeline will automatically publish a new package under the `latest` tag. Any changes made by the release process to the `main` branch will automatically be merged back into `next` and `development`.

To fix a critical bug that is in `main`, branch of the `main` branch. When your work is complete open a PR against `main`, and when it is approved, merge it back into `main` using the "Squash and merge" option. The change will be automatically merged back into `next` and `development`. However, if there is a merge conflict doing so, you will have to resolve it manually.

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for our commit messages. This allows us to automatically generate changelogs and version bumps based on the commit messages. Please take care in your commit messages that make it into the main branches (`development`, `next`, and `main`) to follow this specification, as it helps with the release process.

## Troubleshooting

> [!WARNING]
> If your `build` command is stuck and not finishing, try resetting the cache via `npx nx reset`
