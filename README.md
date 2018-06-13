# PWA Starter Kit Docs

This `gh-pages` branch contains the documentation for the `pwa-starter-kit` project.
It is a static site rendered via [Jekyll](https://jekyllrb.com/).

The folder structure is roughly this:
```
├── _layouts
|   └── ...
└── css
|   └── ...
└── images
|   └── ...
├── _config.yml
├── index.html
├── *.md
```

Where:
- `_layouts` are the Jekyll templates used by different pages. There are two layouts,
`default` (which is used on every page, and sets up the nav header and footer), and `post`, (which sets up the documentation pages in particular, their nav links and content)
- `css` is where the site's css is stored. There are two files, `main.css` (which
  contains general site styles) and `pygments.css` (which contains the code syntax
  highlighting styles)
- `images` contains the different static images used across the site
- `_config.yml` is the Jekyll configuration file
- `index.html` is the main landing page. It uses the `default` layout, and adds
the extra copy to it.
- `*.md` are the markdown files rendered in the static site. They are all using the `post` layout, and Jekyll transforms them to static html pages.

## Sending a PR for the docs
Most of the time if you want to send a PR to update the documentation, you'll want to update one of the `.md` files.
Make sure that when sending the PR, the base branch is `gh-pages`:
![screenshot of github PR base branch](https://user-images.githubusercontent.com/1369170/41371387-013f6c5a-6eff-11e8-93fe-906bf66a8eea.png)

## Running locally  
You need to first have `ruby` and the `jekyll` gem installed on your computer. Installing `ruby` on your computer might differ,
and as JavaScript developers, we're not confident enough to recommend you a preferred method (thought [rvm](https://rvm.io/) and [rbenv](https://github.com/rbenv/rbenv) are two popular approaches). Once you've set things up, you can run the
site via

```
cd pwa-starter-kit
jekyll serve --watch
```
