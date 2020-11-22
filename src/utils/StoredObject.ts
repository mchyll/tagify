export class StoredObject<T extends Object> {
  private obj: T;
  private _hasValue: boolean;

  constructor(private storage: Storage, private readonly storageKey: string) {
    const raw = this.storage.getItem(this.storageKey);
    if (raw) {
      this.obj = JSON.parse(raw);
      this._hasValue = true;
    }
    else {
      this.obj = {} as T;
      this._hasValue = false;
    }
  }

  hasValue() {
    return this._hasValue;
  }

  get() {
    return this.obj;
  }

  save(obj: T) {
    this.obj = obj;
    this._hasValue = true;
    this.storage.setItem(this.storageKey, JSON.stringify(this.obj));
  }

  remove() {
    this.obj = {} as T;
    this._hasValue = false;
    this.storage.removeItem(this.storageKey);
  }
}
