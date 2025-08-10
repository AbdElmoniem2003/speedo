import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment"

@Pipe({
  name: 'timeFormate'
})

export class TimeFormatePipe implements PipeTransform {
  transform(value: any, formate: string): any {
    moment.locale('ar');
    const valueMS = new Date(value).getTime();
    if (formate == 'time') {
      let formatedTime = moment(valueMS).format('hh:mm a')
      if (formatedTime.includes('م')) formatedTime = formatedTime.replace('م', 'مساءاً')
      if (formatedTime.includes('ص')) formatedTime = formatedTime.replace('ص', 'صباحاً')
      return formatedTime
    }
    else if (formate == 'date') {
      let formatedTime = moment(valueMS).format("LL");
      return formatedTime
    }
    else {
      return moment(valueMS).format()
    }
  }
}
