# TagifyJS
JS component library for [Tagify](https://www.zoomio.org/tagify).

## How to install "Tagify" on you web-site

### 1. Sign in
Go to [Tagify](https://www.zoomio.org/tagify) and click "Log in" button at the top-right of the current page.

### 2. Register a Web-site
After you've logged in, you should be able to see "Register site" section in the top menu above.

### 3. Get Web-site ID
On the "Register site" put address of the web-site into the "Site" input and click "Register" button, it will result in ID showed above. Copy the ID and save it, you'll need it later.

### 4. Add TagifyJS to the web-site
Insert `<script type="text/javascript" src="https://www.zoomio.org/tagifyjs/tagify.js"></script>` into the `<head>` section on the registered web-site.

### 5. a) Mark pages in the list
Use API provided by the TagifyJS library to generate tags for selected pages:
```javascript
<script>
  tagifyjs.tagsForAnchors({
      // paste your ID from the step 4 in here
      appId: 'ID_provided_on_the_step_4',
      // CSS class of the pages links (i.e. <a> tags) 
      // you'd like to generate tags for
      anchorsClassName: 'my-awesome-article-link',
      // CSS class of the HTML tags you'd like 
      // to display tags in (should be next to the <a> tags)
      targetsClassName: 'my-awesome-article-tags',
      // address of the page with relevant pages for a tag
      pagesUrl: 'https://my-awesome-web-site.com/blog/relevant',
      // number of tags to generate
      tagLimit: 3,
      // number of pages in single request
      batchLimit: 5,
      // enables admin mode for editing tags
      isAdmin: false
  });
</script>
```

### 5. b) Optional - mark individual pages
This is an optional step. On the pages where you show full body, place following to display releavnt tags:
```javascript
<script>
  tagifyjs.tagsForPage({
    // paste your ID from the step 4 in here
    appId: 'ID_provided_on_the_step_4',
    // CSS id of the HTML tag you'd like 
    // to display relevant tags/keywords in
    targetId: 'my-awesome-relevant-tags',
    // address of the page with relevant pages for a tag
    pagesUrl: 'https://my-awesome-web-site.com/blog/relevant',
    // number of tags to generate
    tagLimit: 3,
    // enables admin mode for editing tags
    isAdmin: false
  });
</script>
```

### 6. Provide list of relevant
Final step is to provide a page where you'll display relevant content for given tag/keyword.

It should be a separate page on which you'd need to add following:
```javascript
<div>
  <div id="relevant-pages"></div>
  <script>
    tagifyjs.relevant({
      // paste your ID from the step 4 in here
      appId: 'ID_provided_on_the_step_4',
      // CSS id of the HTML tag you'd 
      // like to display relevant stuff in
      targetId: 'relevant-pages'
    });
  </script>
</div>
```
Congratulations you are now all set and ready to use [Tagify](https://www.zoomio.org/tagify)!

## Development
 - Raise a PR against master branch;
 - Get PR approved;
 - Tag latest commit with the release tag and push it (`TAG=x.y.z npm run tag`);
 - Merge PR.

## Publishing

- Bump version in `package.json`;
- Run `npm run build`;
- Run `npm publish --access public`.
