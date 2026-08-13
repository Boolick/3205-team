import { sleep } from "./sleep.util";

export interface UrlCheckResult {
  status: "success" | "error";
  httpCode?: number;
  errorMessage?: string;
  duration: number;
}
/**
 * Executes native fetch(HEAD) on the URL with a 5s timeout,
 * applies artificial random delay (0-10s) AFTER fetch, and returns structured result.
 */
export async function checkUrl(
  url: string,
  jobSignal: AbortSignal,
): Promise<UrlCheckResult> {
  const startTime = Date.now();

  // Combine job cancellation signal with a 5-second HTTP request timeout
  const timeoutSignal = AbortSignal.timeout(5000);
  const combinedSignal = AbortSignal.any
    ? AbortSignal.any([jobSignal, timeoutSignal])
    : createCombinedSignal(jobSignal, timeoutSignal);

  let status: "success" | "error" = "error";
  let httpCode: number | undefined = undefined;
  let errorMessage: string | undefined = undefined;

  try {
    if (jobSignal.aborted) {
      throw new Error("Job cancelled");
    }

    const response = await fetch(url, {
      method: "HEAD",
      signal: combinedSignal,
      headers: {
        "User-Agent": "URLChecker-BFF/1.0",
      },
    });

    httpCode = response.status;
    if (response.ok) {
      status = "success";
    } else {
      status = "error";
      errorMessage = `HTTP Status ${response.status} ${response.statusText}`;
    }
  } catch (error: unknown) {
    if (jobSignal.aborted) {
      throw error; // Re-throw abort to be handled by caller
    }

    status = "error";
    const err = error as Error | undefined;
    if (err?.name === "TimeoutError" || timeoutSignal.aborted) {
      errorMessage = "Request timed out (5s limit)";
    } else {
      errorMessage = err?.message || "Fetch failed";
    }
  }

  // Apply artificial delay (0-10 seconds) AFTER fetch, BEFORE saving result
  const delayMs = Math.floor(Math.random() * 10000);
  await sleep(delayMs, jobSignal);

  const duration = Date.now() - startTime;

  return {
    status,
    httpCode,
    errorMessage,
    duration,
  };
}

/**
 * Fallback helper to combine multiple AbortSignals if AbortSignal.any is not present in runtime environment.
 */
function createCombinedSignal(
  signal1: AbortSignal,
  signal2: AbortSignal,
): AbortSignal {
  const controller = new AbortController();
  const onAbort = (): void => controller.abort();
  if (signal1.aborted || signal2.aborted) {
    controller.abort();
  } else {
    signal1.addEventListener("abort", onAbort, { once: true });
    signal2.addEventListener("abort", onAbort, { once: true });
  }
  return controller.signal;
}
