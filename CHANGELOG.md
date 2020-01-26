# Changelog
All notable changes to this project will be documented in this file.

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