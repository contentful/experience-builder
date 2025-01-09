const path = require('path');

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Dynamically import the ES Module
  const { fetchById, detachExperienceStyles } = await import('@contentful/experiences-sdk-react');

  const response = await graphql(`
    query {
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
    }
  `);

  if (response.errors) {
    reporter.panicOnBuild('Error while querying Contentful data', response.errors);
    return;
  }
  
  const { useContentfulClient } = require('./src/utils/useContentfulClient.ts');
  const client = useContentfulClient();
  const { nodes } = response.data.allContentfulExperience;

  for (const node of nodes) {
    const { slug, title, node_locale: localeCode, contentful_id, sys } = node;

    try {
      const experienceEntry = await fetchById({
        client,
        experienceTypeId: sys.contentType.sys.id,
        localeCode,
        id: contentful_id,
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
          experienceStyles,
        },
      });
    } catch (err) {
      reporter.warn(`Error creating page for slug "${slug}": ${err.message}`);
    }
  }
};
