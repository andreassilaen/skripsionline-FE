// import { datePickerValueManager } from "@mui/x-date-pickers/DatePicker/shared";
import dayjs from "dayjs";

export const formatRupiah = (nominal) => {
  return "Rp" + nominal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
};

export const formatCurrency = (value, locale, currencyCode, fractionDigits) => {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: fractionDigits,
  })
    .format(value)
    .replace(/\s/g, "");
};

export const formatNumberNominal = (value, locale) => {
  return Intl.NumberFormat(locale, {
    style: "decimal",
  })
    .format(value)
    .replace(/\s/g, "");
};

export const formatDate = (date, format = "DD MMM YYYY") => {
  if (!date) {
    return "";
  }

  return dayjs(date).format(format);
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const getMonthShortName = (month) => {
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month - 1];
};
