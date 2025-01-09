import path from 'path';
import { fetchById, detachExperienceStyles } from '@contentful/experiences-sdk-react';
import { useContentfulClient } from '../utils/useContentfulClient';

exports.createPages = async ({ graphql, actions, reporter }: any) => {
  const { client } = useContentfulClient();
  const { createPage } = actions;

  // Assume that your experience type id is "experience"
  const response = await graphql(`
    allContentfulExperience {
      nodes {
        contentful_id
        slug
        title
        node_locale
        sys {
          contentType {
            sys {
              id
            }
          }
        }
      }
    }
  `);

  if (response.errors) {
    // handle errors
  }

  const { nodes } = response.data.allContentfulExperience;

  for (const node of nodes) {
    const { slug, title, node_locale: localeCode, contentful_id, sys } = node;

    const experienceEntry = await fetchById({
        client,
        experienceTypeId: sys.contentType.sys.id,
        localeCode,
        id: contentful_id
    });

    let experienceStyles = '';

    if (experienceEntry) {
      experienceStyles = detachExperienceStyles(experienceEntry) ?? '';
    }

    createPage({
      path: `/experience/${slug}`,
      component: path.resolve('src/templates/experiencePage.js'),
      context: {
        title,
        experienceEntryJSON: JSON.stringify(experienceEntry),
        locale: localeCode,
        experienceStyles
      }
    });
  }
};