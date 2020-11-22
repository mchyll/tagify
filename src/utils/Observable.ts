type OptionalArgTuple<T> = T extends void ? [] : [T];
type Observer<T> = (...value: OptionalArgTuple<T>) => void;

export class Observable<T extends any = void> {
  private observers: Observer<T>[];
  private emittedValues: OptionalArgTuple<T>[];

  constructor(private memorize: boolean = false) {
    this.observers = [];
    this.emittedValues = [];
  }

  subscribe(observer: Observer<T>) {
    this.observers.push(observer);
    if (this.memorize) {
      this.emittedValues.forEach(value => observer(...value));
    }
    return () => {
      this.observers = this.observers.filter(o => o !== observer);
    }
  }

  notify(...value: OptionalArgTuple<T>) {
    if (this.memorize) {
      this.emittedValues.push(value);
    }
    this.observers.forEach(fn => fn(...value));
  }
}
