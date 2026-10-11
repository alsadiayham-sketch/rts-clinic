'use strict';

const { buildOwnerTelemetryPayload } = require('./clinic-telemetry');

const OWNER_TELEMETRY_URL = 'https://rts-royal.pages.dev/api/owner-telemetry';
const DEFAULT_INTERVAL_MS = 5 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_MAX_ATTEMPTS = 3;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class OwnerTelemetryPublisher {
  constructor({
    fetchImpl = globalThis.fetch,
    intervalMs = DEFAULT_INTERVAL_MS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxAttempts = DEFAULT_MAX_ATTEMPTS,
    sleep = wait,
    timerApi = globalThis,
    logger = null,
    endpoint = OWNER_TELEMETRY_URL
  } = {}) {
    this.fetchImpl = fetchImpl;
    this.intervalMs = intervalMs;
    this.timeoutMs = timeoutMs;
    this.maxAttempts = Math.max(1, Math.min(Number(maxAttempts) || DEFAULT_MAX_ATTEMPTS, 3));
    this.sleep = sleep;
    this.timerApi = timerApi;
    this.logger = logger;
    this.endpoint = endpoint;
    this.session = null;
    this.interval = null;
    this.inFlight = null;
    this.publishQueued = false;
    this.controllers = new Set();
  }

  start({ authToken, getState, appVersion }) {
    this.stop();
    if (typeof authToken !== 'string' || !authToken || typeof getState !== 'function') return false;
    this.session = { authToken, getState, appVersion };
    this.interval = this.timerApi.setInterval(() => {
      void this.publishNow().catch(() => {});
    }, this.intervalMs);
    if (typeof this.interval?.unref === 'function') this.interval.unref();
    void this.publishNow().catch(() => {});
    return true;
  }

  stop() {
    if (this.interval !== null) {
      this.timerApi.clearInterval(this.interval);
      this.interval = null;
    }
    this.publishQueued = false;
    this.session = null;
    this.controllers.forEach((controller) => controller.abort());
    this.controllers.clear();
  }

  async publishNow() {
    if (!this.session) return false;
    if (this.inFlight) {
      this.publishQueued = true;
      return this.inFlight;
    }
    const session = this.session;
    this.inFlight = this.publishWithRetry(session)
      .finally(() => {
        this.inFlight = null;
        if (this.publishQueued && this.session === session) {
          this.publishQueued = false;
          void this.publishNow().catch(() => {});
        } else {
          this.publishQueued = false;
        }
      });
    return this.inFlight;
  }

  async publishWithRetry(session) {
    let state;
    try {
      state = await session.getState();
    } catch (error) {
      this.reportFailure(error);
      return false;
    }
    const payload = buildOwnerTelemetryPayload(state, {
      appVersion: session.appVersion
    });

    for (let attempt = 1; attempt <= this.maxAttempts; attempt += 1) {
      if (this.session !== session) return false;
      const controller = new AbortController();
      this.controllers.add(controller);
      const timeout = this.timerApi.setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await this.fetchImpl(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.authToken}`
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        if (response?.ok) return true;
        if (!this.shouldRetry(response?.status) || attempt === this.maxAttempts) {
          this.reportFailure(new Error(`Owner telemetry HTTP ${response?.status || 0}`));
          return false;
        }
      } catch (error) {
        if (this.session !== session || attempt === this.maxAttempts) {
          if (this.session === session) this.reportFailure(error);
          return false;
        }
      } finally {
        this.timerApi.clearTimeout(timeout);
        this.controllers.delete(controller);
      }
      await this.sleep(250 * (2 ** (attempt - 1)));
    }
    return false;
  }

  shouldRetry(status) {
    return !status || status === 408 || status === 429 || status >= 500;
  }

  reportFailure(error) {
    if (typeof this.logger === 'function') {
      this.logger('Owner telemetry publish failed:', error?.name || 'request-failed');
    }
  }
}

module.exports = {
  DEFAULT_INTERVAL_MS,
  OWNER_TELEMETRY_URL,
  OwnerTelemetryPublisher
};
