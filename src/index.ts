import tagify from './component';
import { getTagsForPage } from './page';
import { getTagsForAnchors } from './tags';
import { getRelevant } from './relevant';

export const tagsForPage = getTagsForPage;
export const tagsForAnchors = getTagsForAnchors;
export const relevant = getRelevant;
export default tagify;