import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringShorter'
})
export class StringShorterPipe implements PipeTransform {

  transform(value: string, sliceLength: number, addTrailingDots: boolean, numTrailingDots: number): string {
    // Add trailing dots if required by boolean and if value string length is larger than sliceLength
    let trailingDots = '';
    if (addTrailingDots === true && value.length > sliceLength) {
      for (let i = 0; i < numTrailingDots; i++) {
        trailingDots = trailingDots.concat('.');
      }
    }

    const slicedString = value.slice(0, sliceLength);
    const resultString = slicedString.concat(trailingDots);
    return resultString;
  }

}
