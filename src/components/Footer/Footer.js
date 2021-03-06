/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.css';
import Link from '../Link';

function Footer() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <span className={s.text}>©</span>
        <span className={s.spacer} />
        <Link to="https://retropie.org.uk/">Retropie</Link>
        <span className={s.spacer}> - </span>
        <Link to="https://github.com/fechy/retropie-web-gui">
          <i className="fa fa-github"/>
        </Link>
      </div>
    </div>
  );
}

export default withStyles(s)(Footer);
