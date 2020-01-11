import tagify from './component';
import { getTagsForAnchors } from './tags';
import { getRelevant } from './pages';

export const tagsForAnchors = getTagsForAnchors;
export const relevant = getRelevant;
export default tagify;