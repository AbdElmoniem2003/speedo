import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
  name: 'fromNowPipe'
})

export class FromNowPipe implements PipeTransform {
  transform(value: number | string | Date, ...args: any[]): any {
    moment.locale('ar');
    const valueMS = new Date(value).getTime();
    const fromNow = moment(valueMS).fromNow()
    return fromNow
  }
}
