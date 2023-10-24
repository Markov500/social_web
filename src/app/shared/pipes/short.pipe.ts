import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "short"
})
export class shortPipe implements PipeTransform {
    transform(value: string, maxlength = 50): string {
        return value.length <= maxlength ? value : value.substring(0, maxlength) + "...";
    }
}