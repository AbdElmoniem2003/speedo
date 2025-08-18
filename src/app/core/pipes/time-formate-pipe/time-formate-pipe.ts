import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment"

@Pipe({
  name: 'timeFormate'
})

export class TimeFormatePipe implements PipeTransform {
  transform(value: any, formate: string): any {
    moment.locale('ar');

    if (formate == 'time') {
      let formatedTime = moment(value).format('hh:mm a')
      if (formatedTime.includes('م')) formatedTime = formatedTime.replace('م', 'مساءاً')
      if (formatedTime.includes('ص')) formatedTime = formatedTime.replace('ص', 'صباحاً')
      return formatedTime
    }
    else if (formate == 'date') {
      let formatedTime = moment(value).format("LL");
      return formatedTime
    }
    else {
      return moment(value).format("Do MMMM YYYY  -  h:mm a")
    }
  }
}
