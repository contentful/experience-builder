import { useEffect, useState } from "react";

export const useVisualEditor = () => {
  const [tree, setTree] = useState({});
  const [boundVariables, setBoundVariables] = useState<Record<string, any>>({});
  
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // where the app is contentful hosted when run locally
      if (event.origin !== 'http://localhost:3001') {
        return;
      }

      // @ts-expect-error
      let eventData: VisualEditorMessagePayload = {};
        try {
          if (event.data && typeof event.data === 'string') {
            eventData = JSON.parse(event.data);
          }
        } catch (e) {
          console.log('event data caused error', event.data)
        }
        console.log("customer app received message", eventData);

        if (eventData.source === "composability-app") {
          const { payload } = eventData;
  
          switch (eventData.eventType) {
            case 'componentDropped':
              console.log('component dropped', payload);
              break;
            case 'componentTreeUpdated':
              setTree(payload);
              break;
            case 'valueChanged':
              setBoundVariables(payload)
              break;
            default:
          }
        }
    };

    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    }
  }, []);

  return {
    tree,
    boundVariables,
  }
};