import tagify from './component';
import { getTagsForAnchors } from './anchors';
import { getRelevant } from './relevant';

export const tagsForAnchors = getTagsForAnchors;
export const relevant = getRelevant;
export default tagify;