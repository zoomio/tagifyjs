# Changelog
All notable changes to this project will be documented in this file.

## 0.21.0
 - added `#isAuthorized` for convenience of checking whether client is authenticated or not.

## 0.20.0
 - introduced JWT-based authentication flow via Google;
 - added ability to authenticate via the "Log in" button (`#showLogin`) in order to get access to the inline editing feature;
 - lots of refactorings, removed `isAdmin` parameter from all API methods;
 - bumped default tags cache TTL to 30 days.

## 0.19.0
 - introduced `#tagsForContent` which allows to tagify directly passed content instead of passing the URL;
 - refactoring and changes in the API arguments.

## 0.18.1
 - fixed bug with the duplication of tags in case of the cached result and response from API both appended to the DOM.

## 0.18.0
 - render cached results immediately without waiting for the rest of the results to be fetched via network.

## 0.17.0
 - bumped cache TTL to 7 days;
 - exposed method to allow changing it.

## 0.16.0
 - bumped cache TTL to 3 days.

## 0.15.0
 - fixed cache value parsing issues.

## 0.14.0
 - added TTL to the tags cache.

## 0.13.0
 - tag renderer should not be opinionated about number of tags to render.

## 0.12.0
 - provide method for rendering tags for the current page;
 - better errors in console;
 - do not enforse font-size for tags.

## 0.11.0
 - pass `appId` around to fetch right tags;
 - fixed duplication in tag list issue, when editting manually.

## 0.10.0
 - cache considers request tag limit as invalidation mechanism.

## 0.9.0
 - more granular cache, plus cache invalidation on tag editting.

## 0.8.0
 - introduced cache, to save on expensive HTTP calls.

## 0.7.0
 - send more data when remove tag.

## 0.6.0
 - implemented inline tag editing feature for admins;
 - few refactors here and there.

## 0.5.0
 - bug fixes;

## 0.4.0
 - first working MVP with, generates tags for given `<a>` HTML tags and shows relevant pages when clicked;
 - changed `#getTagsForAnchors` to `#tagsForAnchors`;
 - added `#relevant` to be called to show relevant pages for tag.

## 0.3.0
 - exposed default `#tagify` method as `#getTags`;
 - added `#getTagsForAnchors` as a quality of life improvement ofr ease of use;
 - narrowed down `lodash` dependency only to `lodash.noop`.

## 0.2.0
 - breaking change: added support for batch tag rendering, i.e. for multiple targets.

## 0.1.0
 - first release, provides simple API for rendering tags for single target.