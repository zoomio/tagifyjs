import { isAuthed } from './auth';
import tagify from './component';
import { getTagsForContent } from './content';
import { getTagsForPage } from './page';
import { getTagsForAnchors } from './tags';
import { getRelevant } from './relevant';
import { renderLogin } from './login';

export const relevant = getRelevant;
export const showLogin = renderLogin;
export const isAuthorized = isAuthed;
export const tagsForContent = getTagsForContent;
export const tagsForPage = getTagsForPage;
export const tagsForAnchors = getTagsForAnchors;

export default tagify;