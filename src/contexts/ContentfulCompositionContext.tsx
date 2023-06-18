import { createContext, ReactElement, useMemo } from "react";

export type ContentfulCompositionContextProps = {
  locale: string | undefined;
  accessToken: string | undefined;
  spaceId: string | undefined;
  environmentId?: string;
}

const initialProps = {
  locale: undefined,
  accessToken: undefined,
  spaceId: undefined,
  environmentId: 'master',
}

export const ContentfulCompositionContext = createContext<ContentfulCompositionContextProps>(initialProps)

export function ContentfulCompositionContextProvider({
  children,
  locale,
  accessToken,
  spaceId,
  environmentId = 'master',
}: ContentfulCompositionContextProps & { children: ReactElement }): ReactElement {
  const props = useMemo(
    () => ({ locale, accessToken, spaceId, environmentId }),
    [locale, accessToken, spaceId, environmentId]
  );

  return (
    <ContentfulCompositionContext.Provider value={props}>
      {children}
    </ContentfulCompositionContext.Provider>
  );
}