# aniclock

A clock with anime girls holding digits.

It is a webpage, and is intended to be embedded in applications like [Plash](https://github.com/sindresorhus/Plash) as desktop widgets.

Basically it looks like this:

<p align="center" style="image-rendering: pixelated;">
  <img src="https://user-images.githubusercontent.com/55270174/214122884-ba4666ba-205c-4436-b382-c49f7488e860.gif" alt="example" />
</p>

Using [Plash](https://github.com/sindresorhus/Plash) as a desktop widgit:

<p align="center" style="image-rendering: pixelated;">
  <img src="https://user-images.githubusercontent.com/55270174/214129540-828d2c3c-e8c5-4937-84a2-40dfa4c4f431.png" alt="example" />
</p>

## Features

Just have a try! https://charlie0129.github.io/aniclock

- Choose between different digit styles
- Multiple clocks
- Drag to move clocks around
- Preserve settings between webpage reloads
- Time zone customization
- 12/24-hr clock
- Show/Hide settings panel
- Show/Hide seconds/milliseconds
- Custom update/calibration interval

<details>
<summary>What is update/calibration interval?</summary>

- *Update*: update the digits on screen, i.e. let the anime girls show current time.
- *Update interval*: how often an *update* happens. The default 1000ms is sufficient if you don't have milliseconds shown.
- *Calibration*: make a certain *update* as close to the beginning of each second as possible to improve perceived accuracy (only useful when milliseconds is hidden). Why do this? Let's take a example. We assume the digits are actually updated at `09:41:00.863`, but you can only see `09:41:00` and you will probably assume it is excatly `09:41:00.000`. See? That not correct. There is a 863ms difference. But if we update the digits as close to the beginning of each second as possible (e.g. `09:41:00.023`), well, that's much more close to what you see (`09:41:00`).
- *Calibration interval*: how often a *calibration* happens. Since the actual *update interval* is not always the same due to JavaScript nature, so the moment when an *update* happens will slowly drift away from the beginning of each second. So we need regular *calibration*.
</details>

## Possible use case

### macOS desktop widget

I personally use it as a desktop widget with [Plash (available for macOS)](https://github.com/sindresorhus/Plash). Plash takes advantage of the system webview and is very light on system resources.

- Add a new website pointing to https://charlie0129.github.io/aniclock in Plash
- Use *Browsing Mode* to set things up
- Double-click anywhere to close the settings panel (don't worry, your settings will be preserved)

Now you are good to go!

---

>  Note: all the pictures of digits (except the colons) are from [gelbooru](https://gelbooru.com), [konachan](https://konachan.com), and [lolibooru](https://lolibooru.moe).

