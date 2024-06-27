import open from 'open';
import { EnvFileData } from './models.js';
import { getExperienceEntryDemoReqBody, getExperienceContentTypeReqBody } from './content.js';
import { CONSTANTS } from './constants.js';

const baseUrl = process.env.BASE_URL || CONSTANTS.baseUrl;

export class CtflClient {
  public space?: { name: string; id: string };
  public org?: { name: string; id: string };
  public env?: { name: string; id: string };
  public apiKey?: {
    accessToken: string;
    name: string;
    previewKeyId: string;
    previewAccessToken?: string;
  };

  public previewEnvironment?: {
    name: string;
    id: string;
    url: string;
  };

  public apiKeysName = 'Studio Experiences API keys';

  private authToken?: string;
  private authTokenCreatedFromApi = false;

  async createApiKeys() {
    //Create API key
    type ApiKeyReturn = {
      accessToken: string;
      name: string;
      preview_api_key: { sys: { id: string } };
    };
    const apiKey = await this.apiCall<ApiKeyReturn>(`/spaces/${this.space?.id}/api_keys`, {
      body: `{"name":"${this.apiKeysName}"}`,
      method: 'POST',
    }).then((val) => {
      return {
        accessToken: val.accessToken,
        name: val.name,
        previewKeyId: val.preview_api_key.sys.id,
      };
    });
    this.apiKey = apiKey;
    return apiKey;
  }

  async getApiKeys() {
    type ApiKeyReturn = {
      items: { accessToken: string; preview_api_key: { sys: { id: string } }; name: string }[];
    };
    const apiKeys = await this.apiCall<ApiKeyReturn>(`/spaces/${this.space?.id}/api_keys`, {
      method: 'GET',
    }).then((val) => {
      return val.items.map((item) => {
        return {
          accessToken: item.accessToken,
          previewKeyId: item.preview_api_key.sys.id,
          name: item.name,
        };
      });
    });

    return apiKeys;
  }

  async getPreviewAccessToken(id: string) {
    type PreviewKeyReturn = { accessToken: string };
    const previewAccessToken = await this.apiCall<PreviewKeyReturn>(
      `/spaces/${this.space?.id}/preview_api_keys/${id}`,
      {
        method: 'GET',
      },
    ).then((val) => {
      return val.accessToken;
    });
    this.apiKey!.previewAccessToken = previewAccessToken;
  }

  async getSpaceEnablements(orgId: string) {
    type GetSpaceEnablementsReturn = {
      items: {
        sys: { space: { sys: { id: string } } };
        studioExperiences: {
          enabled: boolean;
        };
      }[];
    };
    const enablements = await this.apiCall<GetSpaceEnablementsReturn>(
      `/organizations/${orgId}/space_enablements`,
      {
        method: 'GET',
      },
    );
    return enablements.items;
  }

  async getContentEntry(slug: string, contentTypeId: string) {
    type GetContentEntriesReturn = { items: { sys: { id: string } }[] };
    const entries = await this.apiCall<GetContentEntriesReturn>(
      `/spaces/${this.space?.id}/environments/${this.env?.id}/entries?content_type=${contentTypeId}&fields.slug.${CONSTANTS.locale}=${slug}&limit=1`,
      {
        method: 'GET',
      },
    );
    return entries.items[0]?.sys.id || undefined;
  }

  async createContentEntry(title: string, slug: string, contentTypeId: string) {
    //Create entry
    type ContentEntryReturn = { sys: { id: string } };
    const entryId = await this.apiCall<ContentEntryReturn>(
      `/spaces/${this.space?.id}/environments/${this.env?.id}/entries`,
      {
        method: 'POST',
        headers: {
          'x-contentful-content-type': contentTypeId,
        },
        body: JSON.stringify(getExperienceEntryDemoReqBody(title, slug)),
      },
    ).then((val) => val.sys.id);

    //Publish entry
    await this.apiCall(
      `/spaces/${this.space?.id}/environments/${this.env?.id}/entries/${entryId}/published`,
      {
        method: 'PUT',
        headers: {
          'x-contentful-version': '1',
        },
      },
    );
    return entryId;
  }

  async getExistingExperienceType() {
    type GetContentTypesReturn = {
      items: {
        name: string;
        sys: { id: string };
        metadata: { annotations: { ContentType: { sys: { id: string } }[] } };
      }[];
    };
    return await this.apiCall<GetContentTypesReturn>(
      `/spaces/${this.space?.id}/environments/${this.env?.id}/content_types`,
      {
        method: 'GET',
      },
    ).then((val) => {
      for (const item of val.items) {
        if (
          item.metadata?.annotations?.ContentType?.some(
            (ct) => ct.sys.id === 'Contentful:ExperienceType',
          )
        ) {
          // Return the first Content Type found (currently there can be only one Experience Type per space)
          return {
            id: item.sys.id,
            name: item.name,
          };
        }
      }
    });
  }

  async createContentType(contentTypeName: string, contentTypeId: string) {
    // Create Content Type
    await this.apiCall(
      `/spaces/${this.space?.id}/environments/${this.env?.id}/content_types/${contentTypeId}`,
      {
        headers: {
          'x-contentful-version': '0',
        },
        body: JSON.stringify(getExperienceContentTypeReqBody(contentTypeName)),
        method: 'PUT',
      },
    );

    // Publish Content Type
    await this.apiCall(
      `/spaces/${this.space?.id}/environments/${this.env?.id}/content_types/${contentTypeId}/published`,
      {
        headers: {
          'x-contentful-version': '1',
        },
        method: 'PUT',
        body: null,
      },
    );
  }

  async createPreviewEnvironment(port: string, contentTypeName: string, contentTypeId: string) {
    await this.apiCall(`/spaces/${this.space?.id}/preview_environments`, {
      method: 'POST',
      body: JSON.stringify({
        name: `Preview for ${contentTypeName}`,
        description: `Generated by the Contentful Studio Experiences CLI on ${new Date().toLocaleString()}.`,
        configurations: [
          {
            contentType: contentTypeId,
            url: `http://localhost:${port}`,
            enabled: true,
          },
        ],
      }),
    });
  }

  async getPreviewEnvironments() {
    type PreviewEnvironmentsReturn = {
      items: {
        name: string;
        sys: { id: string };
        configurations: { contentType: string; url: string }[];
      }[];
    };
    const previewEnvironments = await this.apiCall<PreviewEnvironmentsReturn>(
      `/spaces/${this.space?.id}/preview_environments`,
      {
        method: 'GET',
      },
    ).then((val) => {
      return val.items.map((item) => {
        return {
          name: item.name,
          id: item.sys.id,
          url: item.configurations[0].url,
        };
      });
    });
    return previewEnvironments;
  }

  async deleteAuthToken() {
    if (this.authToken && this.authTokenCreatedFromApi) {
      type KeysReturn = { items: { sys: { id: string; redactedValue: string } }[] };
      const keys: { id: string; redactedValue: string }[] = await this.apiCall<KeysReturn>(
        `/users/me/access_tokens?revokedAt`,
      ).then((data) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.items.map((item: any) => ({
          id: item.sys.id,
          redactedValue: item.sys.redactedValue,
        })),
      );

      const keyToRevoke = keys.find((key) => this.authToken!.endsWith(key.redactedValue));

      if (keyToRevoke) {
        await this.apiCall(`/users/me/access_tokens/${keyToRevoke.id}/revoked`, {
          method: 'PUT',
        });
      }
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

  getEnvFileData(experienceTypeId: string): EnvFileData {
    return {
      environment: this.env!.id,
      spaceId: this.space!.id,
      accessToken: this.apiKey!.accessToken,
      previewAccessToken: this.apiKey!.previewAccessToken!,
      experienceTypeId,
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
      }),
    );
    return orgs;
  }

  async getSpacesForOrg(orgId: string) {
    type SpacesReturn = { items: { name: string; sys: { id: string } }[] };
    const spaces = await this.apiCall<SpacesReturn>(`/organizations/${orgId}/spaces`).then((res) =>
      res.items.map((item) => {
        return {
          name: item.name,
          id: item.sys.id,
        };
      }),
    );
    return spaces;
  }

  async getEnvironments() {
    type EnvironmentsReturn = { items: { name: string; sys: { id: string } }[] };
    const environments = await this.apiCall<EnvironmentsReturn>(
      `/spaces/${this.space?.id}/environments`,
    ).then((res) =>
      res.items.map((item) => {
        return {
          name: item.name,
          id: item.sys.id,
        };
      }),
    );
    return environments;
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
        console.log('[ ctflClient.ts ] apiCall() not OK response => ', await response.json());
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
