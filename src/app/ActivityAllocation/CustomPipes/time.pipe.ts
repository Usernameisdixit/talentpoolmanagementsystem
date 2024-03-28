import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertTo12Hr'
})
export class TimePipe implements PipeTransform {

  /**
   * @param time in 24-hour format (hh:mm/hh:mm:ss)
   * @returns time in 12-hour format (hh:mm/hh:mm:ss AM/PM)
   * @note the result time contains seconds only if the given time contains it
   */
  transform(time: string): unknown {
    let arr = time.split(":");
    let hr = parseInt(arr[0]);
    let min = arr[1];
    let sec = arr.length==3 ? (":"+arr[3]) : "";
    if(hr==12)
      return "12:"+min+sec+" PM";
    else if(hr>12)
      return (hr-12)+":"+min+sec+" PM";
    return hr+":"+min+sec+" AM";
  }

}
