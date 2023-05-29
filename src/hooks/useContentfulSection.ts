import { useComponents } from "./useComponents";
import { ContentfulSection } from "../blocks/ContentfulSection";

export const useContentfulSection = () => {
    const { defineComponent } = useComponents()
    defineComponent(ContentfulSection, {
        id: "ContentfulSection",
        name: "Contentful Section",
        variables: {
            margin: {
                type: "Text",
                group: "style",
                description: "The margin of the section",
                defaultValue: "0",
            },
            padding: {
                type: "Text",
                group: "style",
                description: "The padding of the section",
                defaultValue: "0",
            },
            backgroundColor: {
                type: "Text",
                group: "style",
                description: "The background color of the section",
                defaultValue: "transparent",
            },
            width: {
                type: "Text",
                group: "style",
                description: "The width of the section",
                defaultValue: "100%",
            },
            height: {
                type: "Text",
                group: "style",
                description: "The height of the section",
                defaultValue: "auto",
            },
            orientation: {
                type: "Text",
                group: "style",
                description: "The orientation of the section",
                defaultValue: "horizontal",
            },
            border: {
                type: "Text",
                group: "style",
                description: "The border of the section",
                defaultValue: "0",
            },
            spacing: {
                type: "Text",
                group: "style",
                description: "The spacing between the elements of the section",
                defaultValue: "0px",
            }
        },
        children: true,
    });
}