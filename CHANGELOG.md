# Changelog
All notable changes to this project will be documented in this file.

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