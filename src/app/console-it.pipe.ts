import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'consoleIt'
})
export class ConsoleItPipe implements PipeTransform {
  transform(value: any, incremental: any): any {
    console.log(value);
    return null;
  }
}
