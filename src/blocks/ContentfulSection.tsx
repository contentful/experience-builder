import { Flex } from "@contentful/f36-core";
import { css, cx } from "@emotion/css";
import React from "react";

const styles = {
    defaultStyles: css({
        minHeight: "100px",
        overflow: "scroll",
        flexWrap: "wrap",
        justifyContent: "center",
    }),
};
interface ContentfulSectionProps {
    margin: string;
    padding: string;
    backgroundColor: string;
    width: string;
    height: string;
    orientation: string;
    border: string;
    spacing: string;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}
export const ContentfulSection = ({ onClick, orientation, margin, padding, backgroundColor, width, height, border, spacing, ...props }: ContentfulSectionProps) => {
    const flexDirection = orientation === "horizontal" ? "row" : "column";
    const styleOverrides = css({ margin, padding, backgroundColor, width, height, border, gap: spacing });
    return <Flex flexDirection={flexDirection} {...props} className={cx(styles.defaultStyles, styleOverrides, props.className)} />;
};

