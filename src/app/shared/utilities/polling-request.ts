import { BehaviorSubject, concat, Observable, of } from "rxjs";
import { delay, tap, skip, switchMap } from "rxjs/operators";

/**
 * The following function will accept any request Observable (i.e. - an HTTP Request) and an optional
 * polling interval amount. It will create a stream, set the delay for polling, and via the "tap" operator,
 * it trigger the next request, all after skipping the initial value ('').
 * @param request$
 * @param delayMs
 */
export function pollingRequest(
  request$: Observable<any>,
  delayMs: number = 0
): Observable<any> {
  // create the base BehaviorSubject
  const polling$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  // create the re-polling stream with the specified delay in ms and kick off the next request after the interval
  const rePolling$ = of("").pipe(
    delay(delayMs),
    tap(() => polling$.next({})),
    skip(1)
  );

  // combine the original request with the polling interval stream
  const reqPolling$ = concat(request$, rePolling$);

  return polling$.asObservable().pipe(switchMap(() => reqPolling$));
}
