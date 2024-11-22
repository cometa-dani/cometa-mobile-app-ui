import { FC, Fragment } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Dimensions } from 'react-native';


export const SkeletonLoaderList:
  FC<{ height?: number, numberOfItems?: number, gap?: number }> = ({ height = 108, numberOfItems = 6, gap = 20 }) => {
    const windowWidth = Dimensions.get('window').width;
    const itemWidth = windowWidth - 40; // Subtract padding
    const itemHeight = height;
    const totalHeight = numberOfItems * (itemHeight + gap);

    const rect1Width = itemWidth * 0.40; // 35% of item width
    const rect2Width = itemWidth * 0.60; // 51% of item width
    const rect2X = rect1Width + 20; // Start of second rect, add 20 for gap

    return (
      <ContentLoader
        speed={1}
        style={{ marginVertical: 26 }}
        width={windowWidth}
        height={totalHeight}
        viewBox={`0 0 ${windowWidth} ${totalHeight}`}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Fragment key={i}>
            <Rect
              x="20"
              y={i * (itemHeight + gap) + 6}
              rx="26"
              ry="26"
              width={rect1Width}
              height={itemHeight}
            />
            <Rect
              x={rect2X + 10}
              y={i * (itemHeight + gap) + 6}
              rx="26"
              ry="26"
              width={rect2Width - 10}
              height={itemHeight}
            />
          </Fragment>
        ))}
      </ContentLoader>
    );
  };
