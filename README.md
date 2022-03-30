# aniclock

A clock with anime girls holding digits. 

It is a webpage, and is intended to be embedded in applications like [Plash](https://github.com/sindresorhus/Plash) as desktop widgets.

Basically it looks like this:

<p align="center" style="image-rendering: pixelated;">
  <img src="readme-assets/example.gif" />
</p>

> Saw some black dots around straight lines? They are the artifacts of gif downscaling and will **not** be present in the actual image. However, I am not refering to the pixelated look of the image, which is intended.

## Features

- Double click hours to change styles (small or medium; static or animated).

- Double click minutes to show/hide seconds.

- Drag it to move around.

- Optimized to use the lowest possible resources

  > Although it barely uses any CPU with default settings (animated, showing seconds), if you are nerdy and want to lower CPU usage even further, just give up some appearence: 1. use static (instead of animated) styles 2. hide seconds.

- Position on screen, style, and visibility of seconds are preserved between reloads

## Possible use case

### macOS desktop widget

I personally use it as a desktop widget with [Plash (available for macOS)](https://github.com/sindresorhus/Plash). Plash takes advantage of the system webview and is very light on system resources.

<p align="center" style="image-rendering: pixelated;">
  <img src="readme-assets/macos-widget.gif" />
</p>

For Windows users, try applications like Wallpaper Engine.

---

>  Note: all the pictures of digits (except the colons) are from [gelbooru](https://gelbooru.com), [konachan](https://konachan.com), and [lolibooru](https://lolibooru.moe).

