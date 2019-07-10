type rxjs$PartialObserver<-T> =
  | {
      +next: (value: T) => mixed,
      +error?: (error: any) => mixed,
      +complete?: () => mixed,
    }
  | {
      +next?: (value: T) => mixed,
      +error: (error: any) => mixed,
      +complete?: () => mixed,
    }
  | {
      +next?: (value: T) => mixed,
      +error?: (error: any) => mixed,
      +complete: () => mixed,
    };

declare interface rxjs$ISubscription {
  unsubscribe(): void;
}

type rxjs$TeardownLogic = rxjs$ISubscription | (() => void);

type rxjs$EventListenerOptions =
  | {
      capture?: boolean,
      passive?: boolean,
      once?: boolean,
    }
  | boolean;

type rxjs$ObservableInput<T> = rxjs$Observable<T> | Promise<T> | Iterable<T>;

type rxjs$OperatorFunction<T, R> = (rxjs$Observable<T>) => rxjs$Observable<R>;
type rxjs$OperatorFunctionLast<T, R: rxjs$Observable<*>> = (
  rxjs$Observable<T>,
) => R;

declare class rxjs$Observable<+T> {
  static create(
    subscribe: (
      observer: rxjs$Observer<T>,
    ) => rxjs$ISubscription | Function | void,
  ): rxjs$Observable<T>;

  let<U>(
    project: (self: rxjs$Observable<T>) => rxjs$Observable<U>,
  ): rxjs$Observable<U>;

  observeOn(scheduler: rxjs$SchedulerClass): rxjs$Observable<T>;

  pipe(): rxjs$Observable<T>;

  pipe<A>(op1: rxjs$OperatorFunctionLast<T, A>): A;

  pipe<A, B>(
    op1: rxjs$OperatorFunction<T, A>,
    op2: rxjs$OperatorFunctionLast<A, B>,
  ): B;

  pipe<A, B, C>(
    op1: rxjs$OperatorFunction<T, A>,
    op2: rxjs$OperatorFunction<A, B>,
    op3: rxjs$OperatorFunctionLast<B, C>,
  ): C;

  pipe<A, B, C, D>(
    op1: rxjs$OperatorFunction<T, A>,
    op2: rxjs$OperatorFunction<A, B>,
    op3: rxjs$OperatorFunction<B, C>,
    op4: rxjs$OperatorFunctionLast<C, D>,
  ): D;

  pipe<A, B, C, D, E>(
    op1: rxjs$OperatorFunction<T, A>,
    op2: rxjs$OperatorFunction<A, B>,
    op3: rxjs$OperatorFunction<B, C>,
    op4: rxjs$OperatorFunction<C, D>,
    op5: rxjs$OperatorFunctionLast<D, E>,
  ): E;

  toArray(): rxjs$Observable<T[]>;

  toPromise(): Promise<T>;

  subscribe(observer: rxjs$PartialObserver<T>): rxjs$Subscription;
  subscribe(
    onNext: ?(value: T) => mixed,
    onError: ?(error: any) => mixed,
    onCompleted: ?() => mixed,
  ): rxjs$Subscription;

  _subscribe(observer: rxjs$Subscriber<T>): rxjs$Subscription;

  _isScalar: boolean;
  source: ?rxjs$Observable<any>;
  operator: ?rxjs$Operator<any, any>;
}

declare module '@lugia/listener' {
  declare type RemoveEventHandle = {
    removeListener: Function,
  };

  declare export default class Listener<T> {
    on(eventName: T, cb: Function): RemoveEventHandle;

    once(eventName: T, cb: Function): RemoveEventHandle;

    emit(eventName: string, param: Object): void;
    takeEventData(eventName: string, time: number): Promise<Object[]>;

    fromEvent(eventName: string): rxjs$Observable<any[]>;

    delegate(eventName: string, listener: Listener<any>): RemoveEventHandle;
    take(eventName: string, count: number): Promise<Object[]>;
  }
}
