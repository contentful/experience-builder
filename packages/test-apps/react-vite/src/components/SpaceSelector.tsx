import React from 'react';
import { useContentfulConfig } from '../hooks/useContentfulConfig';
import SpaceForm from './SpaceForm';

interface SpaceSelectorProps {}

const SpaceSelector: React.FC<SpaceSelectorProps> = () => {
  const { config, mode, isPreview, currentConfig, setConfig, availableConfigs, setIsPreview } =
    useContentfulConfig();

  return (
    <div>
      <div>Space: {config.space}</div>
      <div>AccessToken: {config.accessToken}</div>
      <div>Domain: {config.domain}</div>
      <div>Mode: {mode}</div>
      <div>ExperienceTypeId: {config.experienceTypeId}</div>
      <div>
        <label>isPreview:</label>
        <select
          id="select-is-preview"
          value={JSON.stringify(isPreview)}
          onChange={(e) => setIsPreview(JSON.parse(e.target.value))}>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </div>
      <div>
        <label>Available Spaces:</label>
        <select
          id="select-config"
          value={currentConfig}
          onChange={(e) => setConfig(e.target.value)}>
          {availableConfigs.map((key) => {
            return (
              <option key={key} value={key}>
                {key}
              </option>
            );
          })}
        </select>
      </div>
      <SpaceForm config={config} />
    </div>
  );
};

export default SpaceSelector;
