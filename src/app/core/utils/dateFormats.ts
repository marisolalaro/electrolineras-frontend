import * as moment from "moment";
import { environment } from "../environments/environment.development";

export function toDMYdateFormat(date: string){
  return moment(date).format(environment.formatDate);;
}

export function toYMDdateFormat(date: string){
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
}

export function isDateDBFormatValid(date: string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date);
}