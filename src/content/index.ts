/**
 * Site copy lives in markdown — one file per page, written in the same order as the page.
 *
 *   site.md     chrome (nav, ticker, footer)
 *   home.md     homepage
 *   about.md    about
 *   visual.md   Visual & Branding landing
 *   adopt.md    Adopt-a-School
 *   driver.md   Map-aid / driver coordination
 *   vheny.md    Vheny landing + work titles
 *   ai.md       Designing with AI
 *   cv.md       CV
 *
 * The matching .ts file only loads the markdown. Edit the .md to change words.
 * Files are the on-page copy: `#` / `##` / `###` are the headings you see.
 */

export * as site from './site';
export * as home from './home';
export * as about from './about';
export * as visual from './visual';
export * as adopt from './adopt';
export * as driver from './driver';
export * as vheny from './vheny';
export * as ai from './ai';
export * as cv from './cv';
