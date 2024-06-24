import open from 'open';
import { EnvFileData } from './models.js';
import { GetmanySpaceEnablementsReturn } from './types.js';
import {
  getDemoExperienceReqBody,
  getExperienceContentTypeReqBody,
} from './api-requests-builders.js';
const baseUrl = process.env.BASE_URL || 'https://api.contentful.com';
const defaultExperienceName = `CLI Generated Experience Name`;
const defaultExperienceNameId = `cliGeneratedExperienceName`;

export class CtflClient {
  public space?: { name: string; id: string };
  public org?: { name: string; id: string };
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
      body: '{"name":"Experience Builder Keys"}',
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

  /**
   * @description - retrieve Enablements
   */
  async getManySpaceEnablements({ orgId }: { orgId: string }) {
    const getAllEnablementsUrl = `/organizations/${orgId}/space_enablements`;

    try {
      const response = await this.apiCall<GetmanySpaceEnablementsReturn>(getAllEnablementsUrl, {
        method: 'GET',
      });

      return response.items;
    } catch (error) {
      throw new Error(`Unable to retrieve Space Enablements. error: ${error}`);
    }
  }

  async createContentEntry(experienceName: string, experienceNameId: string) {
    //Create entry
    type ContentEntryReturn = { sys: { id: string } };
    const entryId = await this.apiCall<ContentEntryReturn>(
      `/spaces/${this.space?.id}/environments/master/entries`,
      {
        method: 'POST',
        headers: {
          'x-contentful-content-type': experienceNameId,
        },
        body: JSON.stringify(getDemoExperienceReqBody(experienceName)),
      },
    ).then((val) => val.sys.id);

    //Publish entry
    await this.apiCall(
      `/spaces/${this.space?.id}/environments/master/entries/${entryId}/published`,
      {
        method: 'put',
        headers: {
          'x-contentful-version': '1',
        },
      },
    );
  }

  async createContentLayoutType(
    experienceName: string = defaultExperienceName,
    experienceNameId: string,
  ) {
    try {
      // Create Content Type
      await this.apiCall(
        `/spaces/${this.space?.id}/environments/master/content_types/${experienceNameId}`,
        {
          headers: {
            'x-contentful-version': '0',
          },
          body: JSON.stringify(getExperienceContentTypeReqBody(experienceName)),
          method: 'PUT',
        },
      );

      // Publish Content Type
      await this.apiCall(
        `/spaces/${this.space?.id}/environments/master/content_types/${experienceNameId}/published`,
        {
          headers: {
            'x-contentful-version': '1',
          },
          method: 'PUT',
          body: null,
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createPreviewEnvironment(
    port: string,
    experienceName: string = defaultExperienceName,
    experienceNameId: string,
  ) {
    await this.apiCall(`/spaces/${this.space?.id}/preview_environments`, {
      method: 'POST',
      body: JSON.stringify({
        name: `Preview for experience '${experienceName}'`,
        description: `This preview environment was auto generated using the "create-experience-builder" CLI Tool, on ${new Date()}.  A configured Preview Environment is required for the Experience Builder to work.`,
        configurations: [
          {
            contentType: experienceNameId,
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
      accessToken: this.apiKey!.accessToken,
      previewAccessToken: this.apiKey!.previewAccessToken!,
      typeId: defaultExperienceNameId,
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
