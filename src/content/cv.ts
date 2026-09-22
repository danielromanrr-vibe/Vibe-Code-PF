/**
 * CV copy — edit cv.md. This file only loads it.
 */

import source from './cv.md?raw';
import { parseCopyPage } from './loadCopy';

const copy = parseCopyPage(source);

export const page = {
  h1: copy.h1,
  body: copy.intro[0] ?? '',
  contactLabel: copy.intro[1] ?? '',
};
