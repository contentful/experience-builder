import open from 'open';
import { EnvFileData } from './models.js';

const baseUrl = process.env.BASE_URL || 'https://api.contentful.com';
const contentLayoutType = 'DevLayout';

export class CtflClient {
  public space: { name: string; id: string } | undefined;
  private authToken: string | undefined;
  private accessToken: string = '';
  private previewAccessToken: string = '';
  private authTokenCreatedFromApi = false;

  async createApiKeys() {
    //Create API key
    type ApiKeyReturn = { accessToken: string; preview_api_key: { sys: { id: string } } };
    const apiKeys = await this.apiCall<ApiKeyReturn>(`/spaces/${this.space?.id}/api_keys`, {
      body: '{"name":"Experience Builder Dev Keys"}',
      method: 'POST',
    }).then((val) => {
      return {
        accessToken: val.accessToken,
        previewKeyId: val.preview_api_key.sys.id,
      };
    });
    this.accessToken = apiKeys.accessToken;

    //Get Preview Key
    type PreviewKeyReturn = { accessToken: string };
    const previewKey = await this.apiCall<PreviewKeyReturn>(
      `/spaces/${this.space?.id}/preview_api_keys/${apiKeys.previewKeyId}`,
      {
        headers: {
          'content-type': 'application/vnd.contentful.management.v1+json',
          authorization: `Bearer ${this.authToken as string}`,
        },
        method: 'GET',
      }
    ).then((val) => {
      return val.accessToken;
    });
    this.previewAccessToken = previewKey;
  }

  async createContentEntry() {
    //Create entry
    type ContentEntryReturn = { sys: { id: string } };
    const entryId = await this.apiCall<ContentEntryReturn>(
      `/spaces/${this.space?.id}/environments/master/entries`,
      {
        method: 'POST',
        headers: {
          'x-contentful-content-type': contentLayoutType,
        },
        body: JSON.stringify({
          fields: {
            title: { 'en-US': 'homePage' },
            slug: { 'en-US': 'homePage' },
            unboundValues: {
              'en-US': {
                t8s3d2yu4Kp6elHh3MFOD: { value: 'Welcome to Experience Builder!' },
                '48AnlKk_hzR3poirBGJoq': { value: 'h1' },
                yZ0T3Qbr7ZO8CUSJvMF8R: { value: '' },
                XFjLtoeKIQFBAegSpmkSu: { value: '' },
                'qTbSL18NOQ-MnfEIwXjs8': { value: false },
              },
            },
            dataSource: { 'en-US': {} },
            componentTree: {
              'en-US': {
                breakpoints: [
                  {
                    id: 'desktop',
                    query: '*',
                    displayName: 'All Sizes',
                    previewSize: '100%',
                  },
                  {
                    id: 'tablet',
                    query: '<992px',
                    displayName: 'Tablet',
                    previewSize: '820px',
                  },
                  {
                    id: 'mobile',
                    query: '<576px',
                    displayName: 'Mobile',
                    previewSize: '390px',
                  },
                ],
                schemaVersion: '2023-09-28',
                children: [
                  {
                    definitionId: 'contentful-container',
                    variables: {
                      cfVerticalAlignment: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: 'center' },
                      },
                      cfHorizontalAlignment: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: 'center' },
                      },
                      cfMargin: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: '0px' },
                      },
                      cfPadding: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: '0px' },
                      },
                      cfBackgroundColor: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: 'rgba(255, 255, 255, 0)' },
                      },
                      cfWidth: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: 'fill' },
                      },
                      cfHeight: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: 'fit-content' },
                      },
                      cfMaxWidth: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: '100%' },
                      },
                      cfFlexDirection: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: 'row' },
                      },
                      cfFlexWrap: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: 'nowrap' },
                      },
                      cfBorder: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: '0px' },
                      },
                      cfGap: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: '0px' },
                      },
                      cfBackgroundImageUrl: {
                        type: 'UnboundValue',
                        key: 'yZ0T3Qbr7ZO8CUSJvMF8R',
                      },
                      cfBackgroundImageScaling: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: 'fit' },
                      },
                      cfBackgroundImageAlignment: {
                        type: 'DesignValue',
                        valuesByBreakpoint: { desktop: 'left top' },
                      },
                      cfHyperlink: {
                        type: 'UnboundValue',
                        key: 'XFjLtoeKIQFBAegSpmkSu',
                      },
                      cfOpenInNewTab: {
                        type: 'UnboundValue',
                        key: 'qTbSL18NOQ-MnfEIwXjs8',
                      },
                    },
                    children: [
                      {
                        definitionId: 'heading',
                        variables: {
                          text: {
                            key: 't8s3d2yu4Kp6elHh3MFOD',
                            type: 'UnboundValue',
                          },
                          type: {
                            type: 'UnboundValue',
                            key: '48AnlKk_hzR3poirBGJoq',
                          },
                          classes: {
                            type: 'DesignValue',
                            valuesByBreakpoint: { desktop: 'cf-heading' },
                          },
                          cfMargin: {
                            type: 'DesignValue',
                            valuesByBreakpoint: { desktop: '0px' },
                          },
                          cfPadding: {
                            type: 'DesignValue',
                            valuesByBreakpoint: { desktop: '0px' },
                          },
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            },
          },
        }),
      }
    ).then((val) => val.sys.id);

    //Publish entry
    await this.apiCall(
      `/spaces/${this.space?.id}/environments/master/entries/${entryId}/published`,
      {
        method: 'put',
        headers: {
          'x-contentful-version': '1',
        },
      }
    );
  }

  async createContentLayoutType() {
    // Create Content Type
    await this.apiCall(
      `/spaces/${this.space?.id}/environments/master/content_types/${contentLayoutType}`,
      {
        headers: {
          'x-contentful-version': '0',
        },
        body: '{"name":"DevLayout","fields":[{"id":"title","name":"Title","type":"Symbol","required":true,"localized":false,"validations":[]},{"id":"slug","name":"Slug","type":"Symbol","required":true,"localized":false,"validations":[{"unique":true}]},{"id":"componentTree","name":"Component Tree","type":"Object","required":true,"localized":false,"validations":[]},{"id":"dataSource","name":"Data Source","type":"Object","required":true,"localized":false,"validations":[]},{"id":"unboundValues","name":"Unbound Values","type":"Object","required":true,"localized":false,"validations":[]}],"description":"","metadata":{"annotations":{"ContentTypeField":{"dataSource":[{"sys":{"id":"Contentful:ExperienceBuilderField","type":"Link","linkType":"Annotation"},"parameters":{"purpose":"dataSource"}}],"unboundValues":[{"sys":{"id":"Contentful:ExperienceBuilderField","type":"Link","linkType":"Annotation"},"parameters":{"purpose":"unboundValues"}}],"componentTree":[{"sys":{"id":"Contentful:ExperienceBuilderField","type":"Link","linkType":"Annotation"},"parameters":{"purpose":"componentTree"}}]}}},"displayField":"title"}',
        method: 'PUT',
      }
    );

    // Publish Content Type
    await this.apiCall(
      `/spaces/${this.space?.id}/environments/master/content_types/${contentLayoutType}/published`,
      {
        headers: {
          'x-contentful-version': '1',
        },
        method: 'PUT',
        body: null,
      }
    );
  }

  async createPreviewEnvironment(port: string) {
    await this.apiCall(`/spaces/${this.space?.id}/preview_environments`, {
      method: 'POST',
      body: JSON.stringify({
        name: `Preview for experience '${contentLayoutType}'`,
        description: 'This preview is required for the Experience Builder to work.',
        configurations: [
          {
            contentType: contentLayoutType,
            url: `http://localhost:${port}`,
            enabled: true,
          },
        ],
      }),
    });
  }

  async createSpace(name: string, orgId: string) {
    type SpaceReturn = { name: string; sys: { id: string } };
    const space = await this.apiCall<SpaceReturn>('/spaces', {
      method: 'POST',
      headers: {
        'X-Contentful-Organization': orgId,
      },
      body: JSON.stringify({
        name: name,
        defaultLocale: 'en-US',
      }),
    }).then((res) => {
      this.space = {
        name: res.name,
        id: res.sys.id,
      };
      return this.space;
    });

    return space;
  }

  async deleteAuthToken() {
    if (this.authToken && this.authTokenCreatedFromApi) {
      type KeysReturn = { items: { sys: { id: string; redactedValue: string } }[] };
      const keys: { id: string; redactedValue: string }[] = await this.apiCall<KeysReturn>(
        `/users/me/access_tokens?revokedAt`
      ).then((data) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.items.map((item: any) => ({
          id: item.sys.id,
          redactedValue: item.sys.redactedValue,
        }))
      );

      const keyToRevoke = keys.find((key) => this.authToken!.endsWith(key.redactedValue));

      if (keyToRevoke) {
        await this.apiCall(`/users/me/access_tokens/${keyToRevoke.id}/revoked`, {
          method: 'PUT',
        });
      }
    }
  }

  async deleteSpace() {
    if (this.space) {
      await this.apiCall(`/spaces/${this.space.id}`, {
        method: 'DELETE',
      });
    }
  }

  async getAuthToken() {
    const APP_ID = '9f86a1d54f3d6f85c159468f5919d6e5d27716b3ed68fd01bd534e3dea2df864';
    const REDIRECT_URI = 'https://www.contentful.com/developers/cli-oauth-page/';
    const oAuthURL = `https://be.contentful.com/oauth/authorize?response_type=token&client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=content_management_manage&action=cli`;

    await open(oAuthURL, {
      wait: false,
    });
  }

  getEnvFileData(): EnvFileData {
    return {
      environment: 'master',
      spaceId: this.space!.id,
      accessToken: this.accessToken,
      previewAccessToken: this.previewAccessToken,
      typeId: contentLayoutType,
    };
  }

  async getOrgs() {
    type OrgsReturn = { items: { name: string; sys: { id: string } }[] };
    const orgs = await this.apiCall<OrgsReturn>('/organizations').then((res) =>
      res.items.map((item) => {
        return {
          name: item.name,
          id: item.sys.id,
        };
      })
    );
    return orgs;
  }

  async setAuthToken(authToken: string, createdFromApi: boolean = false) {
    this.authToken = authToken;
    const validToken = await this.validateToken();
    if (!validToken) {
      return false;
    }
    this.authTokenCreatedFromApi = createdFromApi;
    return true;
  }

  private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const { headers, method = 'GET', ...otherOptions } = options;
      const baseHeaders = {
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        authorization: `Bearer ${this.authToken as string}`,
        ...headers,
      };
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: baseHeaders,
        ...otherOptions,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      if (response.status !== 204) {
        const data = (await response.json()) as T;
        return data;
      }
      return undefined as T;
    } catch (e) {
      console.error('Error calling Contentful API');
      throw e;
    }
  }

  private async validateToken() {
    try {
      await this.apiCall(`/users/me`);
    } catch (e) {
      return false;
    }
    return true;
  }
}
