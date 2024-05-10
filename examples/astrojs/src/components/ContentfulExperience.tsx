import React from "react";
import {
  ExperienceRoot,
  createExperience,
} from "@contentful/experiences-sdk-react";

function ContentfulExperience({ experienceJSON }) {
  //Recreate the experience object from the serialized JSON
  const experience = createExperience(experienceJSON);

  return <ExperienceRoot experience={experience} locale={"en-US"} />;
}

export default ContentfulExperience;
