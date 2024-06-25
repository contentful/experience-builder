export type GetmanySpaceEnablementsReturn = {
  sys: {
    type: 'Array' | string;
  };
  total: number;
  items: {
    sys: {
      type: 'SpaceEnablement' | string;
      createdAt: string; // datetime
      updatedAt: string; // datetime
      version: number;
      createdBy: {
        sys: {
          type: 'Link' | string;
          linkType: 'User' | string;
          id: string;
        };
      };
      updatedBy: {
        sys: {
          type: 'Link' | string;
          linkType: 'User' | string;
          id: string;
        };
      };
      space: {
        sys: {
          type: 'Link' | string;
          linkType: 'Space' | string;
          id: string;
        };
      };
    };
  }[];
  spaceTemplates: {
    enabled: boolean;
  };
  crossSpaceLinks: {
    enabled: boolean;
  };
  studioExperiences: {
    enabled: boolean;
  };
};
