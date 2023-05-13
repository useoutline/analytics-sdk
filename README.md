# Outline Analytics SDK

![Outline Analytics SDK CI](https://github.com/useoutline/analytics-sdk/actions/workflows/node-ci.yml/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/useoutline/analytics-sdk/badge.svg)](https://coveralls.io/github/useoutline/analytics-sdk) ![Bundle Size](https://img.shields.io/bundlephobia/min/@useoutline/analytics)

## Installation

Install the Outline Analytics SDK using npm:

```
npm install @useoutline/analytics
```

or using Yarn:

```
yarn add @useoutline/analytics
```

If you prefer using a CDN, you can include the following script tag in your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/@useoutline/analytics"></script>
```

or

```html
<script src="https://unpkg.com/@useoutline/analytics"></script>
```

The bundled file size is less than 5kB (4.8kB).

## Usage

### Modern Frameworks (ES Modules)

If you are using a modern JavaScript framework with ES Modules support:

```javascript
import useOutlineAnalytics from '@useoutline/analytics';

await useOutlineAnalytics('OA-xxxxx');
```

### Using the CDN

If you are using the CDN script directly:

```javascript
await window.useOutlineAnalytics('OA-xxxxx');
```

### Options

You can also pass an options object to the `useOutlineAnalytics` function. All properties are optional and have default values:

```javascript
const options = {
  extendPageData: false,
  serverUrl: 'https://api.useoutline.xyz',
  apiVersion: 'v1',
  debug: false,
  mock: false
};

await useOutlineAnalytics('OA-xxxxx', options);
```

#### Option Properties

- `extendPageData`: Set it to `true` to track additional page details like page hash, query parameters, and full path. Defaults to `false`, where only the page path and page title will be tracked.
- `serverUrl`: Specify the URL of the analytics server. Defaults to `'https://api.useoutline.xyz'`. If you are using a self-hosted solution, provide your Outline Analytics server's URL here.
- `debug`: Set it to `true` to enable console logs for debugging. Recommended for development, not recommended for production. Defaults to `false`.
- `mock`: Set it to `true` to disable sending events and sessions to the server. Useful for testing and development environments. Defaults to `false`.

### Methods

The `useOutlineAnalytics` function returns an analytics object with three methods: `start`, `stop`, and `sendEvent`.

#### `start()`

The `start` method sets the analytics state to "tracking" and starts tracking events. This method is called by default when you initialize the SDK. If you have stopped tracking for any reason, you can use this method to resume tracking.

```javascript
const analytics = await useOutlineAnalytics('OA-xxxxx');
analytics.start();
```

#### `stop()`

The `stop` method sets the analytics state to "stopped" and stops all tracking events. You can use this method to programmatically stop tracking events and sessions.

```javascript
const analytics = await useOutlineAnalytics('OA-xxxxx');
analytics.stop();
```

#### `sendEvent(event)`

The `sendEvent` method allows you to send custom events from your code. It accepts a single parameter `event` of type string and sends the custom event to the server. You can view the statistics of these events in the dashboard (console.useoutline.xyz).

```javascript
const analytics = await useOutlineAnalytics('OA-xxxxx');
analytics.sendEvent('eventName');
```

That's it! You are now ready to integrate Outline Analytics into your application and start tracking user interactions.
