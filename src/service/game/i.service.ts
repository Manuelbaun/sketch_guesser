import { Subject } from 'rxjs';

export interface IService<T> extends Subject<T> {}
