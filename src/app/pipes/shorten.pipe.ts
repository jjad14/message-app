import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

  // shorten text for post title/content - Not ready
  transform(value: any, title?: string) {
    const titleCount = title.length;
    const valueCount = value.length;

    if (titleCount >= 150) {
      return;
    } else {
        return value.substr(0, (175 - titleCount) - 5) + ' ...';
    }


  }

}
