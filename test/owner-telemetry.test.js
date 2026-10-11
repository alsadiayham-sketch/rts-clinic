const test = require('node:test');
const assert = require('node:assert/strict');
const { OwnerTelemetryPublisher } = require('../src/owner-telemetry');

function timerApi() {
  const intervals = [];
  const cleared = [];
  return {
    intervals,
    cleared,
    setInterval(callback, delay) {
      const handle = { callback, delay };
      intervals.push(handle);
      return handle;
    },
    clearInterval(handle) {
      cleared.push(handle);
    },
    setTimeout(callback, delay) {
      const handle = setTimeout(callback, delay);
      return handle;
    },
    clearTimeout(handle) {
      clearTimeout(handle);
    }
  };
}

test('publishes with a main-process bearer token and stops on logout lifecycle', async () => {
  const calls = [];
  const timers = timerApi();
  const publisher = new OwnerTelemetryPublisher({
    timerApi: timers,
    intervalMs: 60_000,
    sleep: async () => {},
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return { ok: true, status: 200 };
    }
  });

  assert.equal(publisher.start({
    authToken: 'main-only-token',
    appVersion: '1.0.11',
    getState: async () => ({
      patients: [{ fullName: 'Private patient' }],
      sessions: [],
      payments: []
    })
  }), true);
  await publisher.inFlight;

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://rts-royal.pages.dev/api/owner-telemetry');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer main-only-token');
  assert.equal(JSON.parse(calls[0].options.body).metrics.activeTerminalCount, 1);
  assert.equal(calls[0].options.body.includes('main-only-token'), false);
  assert.equal(calls[0].options.body.includes('Private patient'), false);
  assert.equal(timers.intervals.length, 1);

  publisher.stop();
  assert.equal(publisher.session, null);
  assert.equal(timers.cleared.length, 1);
});

test('bounds telemetry retries and does not reject clinic work', async () => {
  let attempts = 0;
  const publisher = new OwnerTelemetryPublisher({
    maxAttempts: 3,
    sleep: async () => {},
    fetchImpl: async () => {
      attempts += 1;
      return { ok: false, status: 503 };
    }
  });
  publisher.session = {
    authToken: 'main-only-token',
    appVersion: '1.0.11',
    getState: async () => ({ sessions: [], payments: [] })
  };

  assert.equal(await publisher.publishNow(), false);
  assert.equal(attempts, 3);
});
