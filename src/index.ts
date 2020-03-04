import tagify from './component';
import { getTagsForContent } from './content';
import { getTagsForPage } from './page';
import { getTagsForAnchors } from './tags';
import { getRelevant } from './relevant';

export const tagsForContent = getTagsForContent;
export const tagsForPage = getTagsForPage;
export const tagsForAnchors = getTagsForAnchors;
export const relevant = getRelevant;

export default tagify;