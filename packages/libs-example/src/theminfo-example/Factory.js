/**
 *
 * create by ligx
 *
 * @flow
 */
import React, { useEffect, useRef } from 'react';
import Theme from '@lugia/theme-config';

export default (Target: Object, config: Object, viewClass: string) => () => {
  const design = useRef();
  useEffect(() => {
    window[viewClass] = design.current;
  });
  return (
    <Theme config={{ [viewClass]: config }}>
      <Target innerRefForDesign={design} viewClass={viewClass} />
    </Theme>
  );
};
