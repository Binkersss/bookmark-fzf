# fzf-Browser
This is a web extension that allows you to take a different approach to 
tab-overflow. Instead of keeping them open, or manually organizing 
bookmarks, just add and remove tabs to fzf-browser. This will
let you stop trying to remember where you left that tab, as well as the
added benefit of letting you just close a tab when your done with it for
a small amount of time.

## Dev Install

> [!WARNING]  
> Installing an extension with this method is dangerous and should only be done with trusted software

1. Clone this repository:
```
git clone git@github.com:Binkersss/bookmark-fzf.git
```

2. Navigate to your browsers dev-extensions menu:
     - Firefox (and descendants): about:debugging#/runtime/this-firefox
     - Chromium (and descendants): chrome://extensions/ 
            - Make sure you enable dev mode

3. Select load-temporary or load unpacked and choose the repos manifest (Firefox) or root directory (Chromium)

## Usage
- `alt+b` opens the extension
- `alt+y` adds the current tab to your 'cache'
- `alt+v` deletes the selected tab when the extension is open
- `alt+a` adds the current tab to your 'cache' when the extension is open (redundant??)

### Credits
Inspiration for this comes from Telescope.nvim and the 100's of tabs on my wifes macbook
