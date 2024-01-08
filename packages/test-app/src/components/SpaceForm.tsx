import React, { useState } from 'react';
import { ContentfulConfig } from '../utils/models';

interface SpaceFormProps {
  config?: ContentfulConfig;
}

const SpaceForm: React.FC<SpaceFormProps> = ({ config }) => {
  const [space, setSpace] = useState(config?.space || '');
  const [accessToken, setAccessToken] = useState(config?.accessToken || '');
  const [previewToken, setPreviewToken] = useState(config?.previewToken || '');
  const [experienceTypeId, setExperienceTypeId] = useState(config?.experienceTypeId || '');
  const [domain, setDomain] = useState(config?.domain || 'contentful.com');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Space:
        <input type="text" value={space} onChange={(e) => setSpace(e.target.value)} />
      </label>
      <label>
        Access Token:
        <input type="text" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} />
      </label>
      <label>
        Preview Token:
        <input type="text" value={previewToken} onChange={(e) => setPreviewToken(e.target.value)} />
      </label>
      <label>
        Experience Type ID:
        <input
          type="text"
          value={experienceTypeId}
          onChange={(e) => setExperienceTypeId(e.target.value)}
        />
      </label>
      <label>
        Domain:
        <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SpaceForm;
