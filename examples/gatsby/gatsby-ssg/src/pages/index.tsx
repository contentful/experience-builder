import * as React from "react"
import type { PageProps } from "gatsby"
import { navigate } from 'gatsby';

const IndexPage: React.FC<PageProps> = () => {
  React.useEffect(() => {
    navigate('/home-page');
  }, []);
  
  return null;
}

export default IndexPage
