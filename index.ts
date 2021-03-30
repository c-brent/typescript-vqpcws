import { combineLatest, forkJoin, Observable, of } from "rxjs";
import { Subject } from "rxjs";
import { concatMap, delay, filter, mergeMap, take } from "rxjs/operators";

//emit delay value
const first = of({ status: "OK", node: "GN" });
const second = of({ status: "OK", node: "CR" });

const nodeByKey$ = of({ status: "OK", node: "SN" });
const connected = of(false);

const subject$ = new Observable();
console.log("Start:");

const obs: Observable<any>[] = [first, second];
const test$ = forkJoin(obs);

const restart$ = combineLatest([nodeByKey$, connected]);
const progress$ = restart$.pipe(
  filter(([sysRestarted, sysConnected]) => sysRestarted && !sysConnected),
  concatMap(() => test$),
  concatMap(() => of({ progress: "10" }))
);

const sub = progress$.subscribe(v => console.log(JSON.stringify(v)));

// const example = source.pipe(
//   concatMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
// );
//output: With concatMap: Delayed by: 2000ms, With concatMap: Delayed by: 1000ms
// const subscribe = example.subscribe(val =>
//   console.log(`With concatMap: ${val}`)
// );

// showing the difference between concatMap and mergeMap
// const mergeMapExample = source
//   .pipe(
//     // just so we can log this after the first example has run
//     delay(5000),
//     mergeMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
//   )
//   .subscribe(val => console.log(`With mergeMap: ${val}`));
