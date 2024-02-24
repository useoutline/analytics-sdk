# Outline Analytics SDK

The Outline Analytics SDK is a powerful and lightweight JavaScript library that allows you to easily integrate analytics tracking into your web applications. With just a few lines of code, you can start capturing user events, page views, and sessions, and gain valuable insights into how users interact with your application.

The SDK is designed to be simple and developer-friendly. It offers a cookie-free approach using local storage and provides a straightforward API for initializing the analytics, starting and stopping tracking, and sending custom events. By default, it tracks page views and sessions, and you can easily configure additional events to be tracked via the dashboard, eliminating the need for manual updates in your codebase.

![Outline Analytics SDK CI](https://github.com/useoutline/analytics-sdk/actions/workflows/node-ci.yml/badge.svg) ![Bundle Size](https://edge.bundlejs.com/badge?q=@useoutline/analytics) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/) [![Coverage Status](https://coveralls.io/repos/github/useoutline/analytics-sdk/badge.svg)](https://coveralls.io/github/useoutline/analytics-sdk)

## Table of Contents

- [Outline Analytics SDK](#outline-analytics-sdk)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Init using modern frameworks (ES Modules)](#init-using-modern-frameworks-es-modules)
    - [Init using the CDN](#init-using-the-cdn)
    - [Init Options](#init-options)
      - [Init Option Properties](#init-option-properties)
    - [Methods](#methods)
      - [`start()`](#start)
      - [`stop()`](#stop)
      - [`sendEvent(event: string, data?: Record<string, string | number>)`](#sendeventevent-string-data-recordstring-string--number)
      - [`setData(data: Record<string, string | number>)`](#setdatadata-recordstring-string--number)
    - [Typescript Support](#typescript-support)

## Installation

Install the Outline Analytics SDK using npm:

```bash
npm install @useoutline/analytics
```

or using Yarn:

```bash
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

If you want to init the SDK using the CDN, you can use the following code:

```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/@useoutline/analytics"
  data-outline-analytics-id="OA-xxxxx"
></script>
```

The bundled file size is less than 6kB.

## Usage

### Init using modern frameworks (ES Modules)

If you are using a modern JavaScript framework with ES Modules support:

```javascript
import useOutlineAnalytics from '@useoutline/analytics'

await useOutlineAnalytics('OA-xxxxx')
```

### Init using the CDN

If you prefer using the CDN:

```javascript
await window.useOutlineAnalytics('OA-xxxxx')
```

### Init Options

You can also pass an options object to the `useOutlineAnalytics` function. All properties are optional and have default values:

```javascript
const options = {
  serverUrl: 'https://api.useoutline.xyz',
  debug: false,
  mock: false,
  data: {
    a: '1',
  },
}

await useOutlineAnalytics('OA-xxxxx', options)
```

Init returns a promise which resolves to an analytics object. The analytics object has four methods: `start`, `stop`, `sendEvent` and `setData`. You can use these methods to start and stop tracking, send custom events, and send additional data with every event.

```javascript
const analytics = await useOutlineAnalytics('OA-xxxxx')
```

#### Init Option Properties

Options object is optional and has following properties:

- `serverUrl`: [string] (Optional) Specify the URL of the analytics server. Defaults to `'https://api.useoutline.xyz'`. If you are using a self-hosted solution, provide your Outline Analytics server's URL here.
- `debug`: [boolean] (Optional) Set it to `true` to enable console logs for debugging. Recommended for development, not recommended for production. Defaults to `false`.
- `mock`: [boolean] (Optional) Set it to `true` to disable sending events and sessions to the server. Useful for testing and development environments. Defaults to `false`.
- `data`: [object where key is string and value can be string or number] (Optional) Set it to an object to send additional data with every event. You can include a maximum of three key-value pairs. If you provide more than three key-value pairs, the server will disregard the data option and will not store it.

If you're initing using CDN and `data-outline-analytics-id` attribute, you can pass the following attributes to the same script
**Note**: Here you can use following attributes to configure the SDK:

- `data-outline-analytics-id`: [string] Specify the Outline Analytics ID to use. You can find this ID in the dashboard (console.useoutline.xyz).
- `data-outline-analytics-server-url`: [string] Specify the URL of the analytics server. Defaults to `'https://api.useoutline.xyz'`. If you are using a self-hosted solution, provide your Outline Analytics server's URL here.
- `data-outline-analytics-debug`: [boolean] Set it to `true` to enable console logs for debugging. Recommended for development, not recommended for production. Defaults to `false`.
- `data-outline-analytics-mock`: [boolean] Set it to `true` to disable sending events and sessions to the server. Useful for testing and development environments. Defaults to `false`.
- `data-outline-analytics-data-[key]`: where key is string and value can be string or number. You can include a maximum of three attributes of this kind. If you provide more than three attributes of this kind pairs, the server will disregard the data option and will not store it. Eg: `data-outline-analytics-data-a="1"`. Also note that the key should be in lowercase and separated by hyphens.

### Methods

The `useOutlineAnalytics` function returns an analytics object with four methods: `start`, `stop`, `sendEvent` and `setData`.

#### `start()`

The `start` method sets the analytics state to "tracking" and starts tracking events. This method is called by default when you initialize the SDK. If you have stopped tracking for any reason, you can use this method to resume tracking.

```javascript
const analytics = await useOutlineAnalytics('OA-xxxxx')
analytics.start()
```

#### `stop()`

The `stop` method sets the analytics state to "stopped" and stops all tracking events. You can use this method to programmatically stop tracking events and sessions.

```javascript
const analytics = await useOutlineAnalytics('OA-xxxxx')
analytics.stop()
```

#### `sendEvent(event: string, data?: Record<string, string | number>)`

The `sendEvent` method allows you to send custom events from your code. It accepts a single parameter `event` of type string and sends the custom event to the server. Optionally it also accepts `data` which is a key value type record where key is string and value can either be string or number. The `data` will override the data option provided in the options object during init. You can view the statistics of these events in the dashboard (console.useoutline.xyz).

```javascript
const analytics = await useOutlineAnalytics('OA-xxxxx')
analytics.sendEvent('eventName')
analytics.sendEvent('eventName', { key: 'value' })
analytics.sendEvent('eventName', { key: 123 })
```

#### `setData(data: Record<string, string | number>)`

The `setData` method allows you to send additional data with every event. It accepts a single parameter `data` which is a key value type record where key is string and value can either be string or number. You can include a maximum of three key-value pairs. If you provide more than three key-value pairs, the server will disregard the data option and will not store it. This will override the data option provided in the options object during init.

```javascript
const analytics = await useOutlineAnalytics('OA-xxxxx')
analytics.setData({ key: 'value', a: 1, b: '2' })
```

### Typescript Support

The SDK is built with TypeScript, so you can enjoy all the benefits of TypeScript type checking and auto-completion when using the Outline Analytics SDK in your projects.

That's it! You are now ready to integrate Outline Analytics into your application and start tracking user interactions.

If you have any questions or feedback, please feel free to reach out to us at <https://x.com/useoutlinexyz> or start a discussion on our GitHub repository at <https://github.com/orgs/useoutline/discussions>
