import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

// This is a validator that will validate the mime type of a file (image in this case) here

export const mimeType = (
    control: AbstractControl
): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {

    if (typeof(control.value) === 'string') {
        return of(null);
    }

    const file = control.value as File;
    const fileReader = new FileReader();
    // Observable.create
    const frObs = new Observable((observer: Observer<{[key: string]: any}>) => {
        fileReader.addEventListener('loadend', () => {
            // MIME type validation
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = '';
            let isValid = false;
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }

            switch (header) {
                case '89504e47':
                  isValid = true;
                  break;
                // these are patterns which stand for certain file types (png, jpg etc)
                case 'ffd8ffe0':
                case 'ffd8ffe1':
                case 'ffd8ffe2':
                case 'ffd8ffe3':
                case 'ffd8ffe8':
                  isValid = true;
                  break;
                default:
                  // Or you can use the blob.type as fallback
                  isValid = false;
                  break;
            }

            if (isValid) {
                observer.next(null);
              } else {
                observer.next({ invalidMimeType: true });
              }
            observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
    });
    return frObs;
};










