import React from 'react';
import AlignBottom from '@svg/composition/AlignBottom.svg';
import AlignCenteralHorizontal from '@svg/composition/AlignCenterHorizontal.svg';
import AlignCenteralVertical from '@svg/composition/AlignCenterVertical.svg';
import AlignLeft from '@svg/composition/AlignLeft.svg';
import AlignRight from '@svg/composition/AlignRight.svg';
import AlignTop from '@svg/composition/AlignTop.svg';
import BorderWidthLines from '@svg/composition/border-width-lines.svg';
import ColumnGap from '@svg/composition/ColumnGap.svg';
import CompositionFallBackIcon from '@svg/composition/composition-fall-back-icon.svg';
import CompositionIconCode from '@svg/composition/composition-icon-code.svg';
import CompositionIconDate from '@svg/composition/composition-icon-date.svg';
import CompositionIconLocation from '@svg/composition/composition-icon-location.svg';
import CompositionIconText from '@svg/composition/composition-icon-text.svg';
import CompositionLayersIcon from '@svg/composition/composition-layers-icon.svg';
import DesktopIcon from '@svg/composition/DesktopIcon.svg';
import DesktopIconSelected from '@svg/composition/DesktopIconSelected.svg';
import EditIcon from '@svg/composition/EditIcon.svg';
import FlexDirectionColumn from '@svg/composition/FlexDirectionColumn.svg';
import FlexDirectionRow from '@svg/composition/FlexDirectionRow.svg';
import MobileIcon from '@svg/composition/MobileIcon.svg';
import MobileIconSelected from '@svg/composition/MobileIconSelected.svg';
import RemoveIcon from '@svg/composition/RemoveIcon.svg';
import RowGap from '@svg/composition/RowGap.svg';
import TabletIcon from '@svg/composition/TabletIcon.svg';
import TabletIconSelected from '@svg/composition/TabletIconSelected.svg';
import WidthIcon from '@svg/composition/WidthIcon.svg';

interface TestSvgProps {}

const TestSvg: React.FC<TestSvgProps> = () => {
  return (
    <div>
      <AlignBottom />
      <AlignCenteralHorizontal />
      <AlignCenteralVertical />
      <AlignLeft />
      <AlignRight />
      <AlignTop />
      <BorderWidthLines />
      <ColumnGap />
      <CompositionFallBackIcon />
      <CompositionIconCode />
      <CompositionIconDate />
      <CompositionIconLocation />
      <CompositionIconText />
      <CompositionLayersIcon />
      <DesktopIcon />
      <DesktopIconSelected />
      <EditIcon />
      <FlexDirectionColumn />
      <FlexDirectionRow />
      <MobileIcon />
      <MobileIconSelected />
      <RemoveIcon />
      <RowGap />
      <TabletIcon />
      <TabletIconSelected />
      <WidthIcon />
    </div>
  );
};

export default TestSvg;
