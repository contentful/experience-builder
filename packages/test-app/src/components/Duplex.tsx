import { useMemo } from 'react';

export interface CtfDuplexPropsInterface {
  headline?: string;
  bodyText?: Document;
  image?: string;
  imageAlign?: 'left' | 'right' | 'top' | 'bottom';
  colorPalette?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Duplex = ({
  image,
  headline,
  bodyText,
  children,
  className,
  imageAlign = 'right',
  ...rest
}: CtfDuplexPropsInterface) => {
  console.log({ image });
  const flexDirection = useMemo(() => {
    if (imageAlign === 'left') {
      return 'flex-row-reverse';
    }

    if (imageAlign === 'top') {
      return 'flex-col-reverse';
    }

    if (imageAlign === 'bottom') {
      return 'flex-col';
    }

    return 'flex-row';
  }, [imageAlign]);

  return (
    <div>
      <div className="flex-1">
        <h1>{headline || 'My headline'}</h1>

        {children && <div className="mt-12"> {children}</div>}
      </div>
      {image && (
        <div className="flex-1">
          <img className="rounded-lg h-[500px] object-cover" src={image} alt={headline} />
        </div>
      )}
    </div>
  );
};
