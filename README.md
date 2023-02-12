# monitor-text-zoom

-   Adds classes to the DOM, at specified text zoom levels, to help with page layout.
-   Optionally stack Bootstrap columns when a specified text zoom level is reached.

<br>

## Installation

### 1. Via file links

Download `dist/monitor-text-zoom.js` and, if you want to stack Bootstrap columns, `dist/monitor-text-zoom.css`.

```html
<script type="text/javascript" src="/path/to/monitor-text-zoom.js"></script>
<!--If you want to stack Bootstrap columns: -->
<link href="/path/to/monitor-text-zoom.css" rel="stylesheet" />
```

### 2. Via package installation

```cmd
npm install monitor-text-zoom
```

```js
import monitorTextZoom from "monitor-text-zoom";
// If you want to stack Bootstrap columns:
import "node_modules/monitor-text-zoom/dist/monitor-text-zoom.css";
```

<br>

## Initialize

Initialize with the size, in pixels, of 1 rem:

```js
window.addEventListener("DOMContentLoaded", () => {
    monitorTextZoom.init({
        remSize: 16
    });
});
```

<br>

## Stack bootstrap columns when a specified text zoom level is reached

```js
monitorTextZoom.init({
    bootstrap: 5 // 3 | 4 | 5
});
```

Specify the class `stack-tz-{value}` to stack the columns if the text zoom percentage is &GreaterEqual; `{value}`.

This example stacks the columns if the text zoom is &GreaterEqual; 130%

```html
<div class="row stack-tz-130">
    <div class="col-sm-6"></div>
    <div class="col-sm-6"></div>
</div>
```

Often, different styles are applied to the un-stacked columns which you may want to omit when the columns are stacked due to text zoom. When stacked, the class `.bs{bootstrap version}-tz-query-match` is attached to the row. You can used this to ensure that the additional styles are not applied:

```css
@media (min-width: 768px) {
    .row:not(.bs5-tz-query-match) {
    }
}
```

<br>

## Add classes to the body node at specific text zoom levels

```js
monitorTextZoom.init({
    attachZoomLevels: [110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 250, 300, 350, 400, 450, 500]
});
```

For each specified text zoom level, the class `tz-{value}` is attached to the body node when the level is &GreaterEqual; to `{value}`.

For instance, if the current text zoom level is `130`, the body node will have the following classes attached: `tz-110`, `tz-120` & `tz-130`.

```css
body.tz-110 .my-node {}
body.tz-120 .my-node {}
body.tz-130 .some-other-node {}
...
```

<br>

## Finer control at node level

### 1. Single query

Add a query to a node. When matched, the class `tz-query-match` is added to the node. In the following example, the query is matched if the current text zoom level &GreaterEqual; 150%:

```html
<div id="element-1" data-query-tz="gte:150"></div>
```

```css
#element-1.tz-query-match {
}
```

As well as `gte`, you can specify `gt`, `lt`, `lte` and `eq`.

### 2. Specify more than one query per node

Specify multiple queries separated by a space. Append the subsequent queries with `[{class name}]`. You can also append a class name to the first query or omit to have the default `tz-query-match` attached.

```html
<div id="element-1" data-query-tz="gte:150 gt:400[massive-zoom-amount]"></div>
```

```css
#element-1.tz-query-match {
}
#element-1.massive-zoom-amount {
}
```

### 3. Complex queries

Use `+` and `|` to specify AND and OR operators. In the following example, the class `tz-query-match` is attached if the current text zoom level is (&GreaterEqual; 150% AND &leq; 200%) OR &GreaterEqual; 300%:

```html
<div data-query-tz="gte:150+lte:200|gte:300"></div>
```

<br>

## Check the current text zoom level

```js
const factor = monitorTextZoom.getZoom().factor;
const percentage = monitorTextZoom.getZoom().percentage;
```

<br>

## Handle text zoom level change

### 1. Via init

```js
monitorTextZoom.init({
    changed: e => {
        console.log(e.factor, e.percentage);
    }
});
```

### 2. Handle event

```js
document.addEventListener("textzoom", e => {
    e = e.detail;
    console.log(e.factor, e.percentage);
});
```

To call `changed` and raise `textzoom` at initialization time:

```js
monitorTextZoom.init({
    notifyLevelOnInit: true
});
```

<br>

## Requery for dynamic content

If you add dynamic content with `stack-tz-{value}` or `data-query-tz`, a requery is required:

```js
monitorTextZoom.requery();
```

<br>

## Credits

-   Based on: https://github.com/zoltan-dulac/text-zoom-resize
