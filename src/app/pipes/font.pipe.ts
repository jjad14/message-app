import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'size'
})
export class FontPipe implements PipeTransform {
  // customize font - Not ready
  transform(value: string) {
    const str = value.fontsize(15);

    return str;
  }

}
