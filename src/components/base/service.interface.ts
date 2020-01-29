import { Subject } from 'rxjs';

export interface ServiceInterface<T> {
	subject: Subject<T>;
	dispose();
}
