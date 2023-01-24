# aniclock

A clock with anime girls holding digits.

It is a webpage, and is intended to be embedded in applications like [Plash](https://github.com/sindresorhus/Plash) as desktop widgets.

Basically it looks like this:

<p align="center" style="image-rendering: pixelated;">
  <img src="https://user-images.githubusercontent.com/55270174/214122884-ba4666ba-205c-4436-b382-c49f7488e860.gif" alt="example" />
</p>

Using [Plash](https://github.com/sindresorhus/Plash) as a desktop widgit:

<p align="center" style="image-rendering: pixelated;">
  <img width="700" src="https://user-images.githubusercontent.com/55270174/214243265-52f92215-6286-403c-828c-308ace9bee1a.jpg" alt="example-plash" />
  <img width="700" src="https://user-images.githubusercontent.com/55270174/214243334-50bd1fe6-a807-4e7d-8a20-00a45c8a3ac2.jpg" alt="example-plash" />
</p>

Settings (experimental):

<p align="center" style="image-rendering: pixelated;">
  <img width="546" alt="image" src="https://user-images.githubusercontent.com/55270174/214243130-987535bf-0c25-4b8d-9156-d51f7a1fc048.jpg">
</p>

## Features

Just have a try! https://charlie0129.github.io/aniclock

- Choose between different digit styles
- Multiple clocks
- Drag to move clocks around
- Preserve settings between webpage reloads
- Time zone customization
- 12/24-hr clock
- Show/Hide settings panel (double-click the clock)
- Show/Hide seconds/milliseconds
- Custom update/calibration interval

<details>
<summary>What is update/calibration interval?</summary>

- _Update_: update the digits on screen, i.e. let the anime girls show current time.
- _Update interval_: how often an _update_ happens. The default 1000ms is sufficient if you don't have milliseconds shown.
- _Calibration_: make a certain _update_ as close to the beginning of each second as possible to improve perceived accuracy (only useful when milliseconds is hidden). Why do this? Let's take a example. We assume the digits are actually updated at `09:41:00.863`, but you can only see `09:41:00` and you will probably assume it is excatly `09:41:00.000`. See? That not correct. There is a 863ms difference. But if we update the digits as close to the beginning of each second as possible (e.g. `09:41:00.023`), well, that's much more close to what you see (`09:41:00`).
- _Calibration interval_: how often a _calibration_ happens. Since the actual _update interval_ is not always the same due to JavaScript nature, so the moment when an _update_ happens will slowly drift away from the beginning of each second. So we need regular _calibration_.
</details>

## Possible use case

### macOS desktop widget

I personally use it as a desktop widget with [Plash (available for macOS)](https://github.com/sindresorhus/Plash). Plash takes advantage of the system webview and is very light on system resources.

- Add a new website pointing to https://charlie0129.github.io/aniclock in Plash
- Use _Browsing Mode_ to set things up
- Close the settings panel (don't worry, your settings will be preserved)

Now you are good to go!

---

> Note: all the pictures of digits (except the colons) are from [gelbooru](https://gelbooru.com), [konachan](https://konachan.com), and [lolibooru](https://lolibooru.moe).
