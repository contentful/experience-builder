import { ReactNode } from 'react';
// import { ContentfulContainer } from '@contentful/experiences-components-react';
// import { Slot } from '@contentful/experiences-components-react';

interface IconGroupProps {
  children: ReactNode;
}

const IconGroup: React.FC<IconGroupProps> = ({ children, ...props }) => {
  // console.log('[DEBUG] IconGroup', { props });
  return (
    <div className="IconGroup" style={{ display: 'flex', gap: 50 }} {...props}>
      <div>IconGroup</div>
      {/* <Slot
        key="zone1"
        // Ideally, we only want to pass style to the Slot component
        style={{ display: 'flex', gap: 20 }}
      /> */}
      {children}
    </div>
  );
};

export default IconGroup;
