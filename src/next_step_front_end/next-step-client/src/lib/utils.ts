import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTextEnum(text: string | null) {
  if (!text) return "Not Specified";
  return text
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function checkExpiryDate(date: string): boolean {
  const expiryDate = new Date(date);
  const today = new Date();

  expiryDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return expiryDate < today;
}

export function calStarReview(averageRating: number) {
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return { fullStars, hasHalfStar, emptyStars };
}

export function fallbackInitials(text: string) {
  return text
    ? text
        .split(" ")
        .map((s) => s[0].toUpperCase())
        .join("")
    : text
      ? text.charAt(0).toUpperCase()
      : "U";
}

export function currencySymbols(currency: string) {
  switch (currency) {
    case "USD":
      return "$";
    case "VND":
      return "₫";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "KRW":
      return "₩";
    case "CNY":
      return "¥";
    case "AUD":
      return "A$";
    case "CAD":
      return "C$";
    case "SGD":
      return "S$";
    default:
      return currency;
  }
}

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
}

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): DebouncedFunction<T> {
  let timeoutId: NodeJS.Timeout | null = null

  const debouncedFunction = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }) as DebouncedFunction<T>

  debouncedFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debouncedFunction
}

export function formatDate(dateString: string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatSalary(
  minSalary: number,
  maxSalary: number,
  currency: string
) {
  if (!minSalary && !maxSalary) return "Negotiable";
  const symbol = currencySymbols(currency);
  if (minSalary && maxSalary && minSalary !== maxSalary) {
    return `${symbol}${minSalary.toLocaleString()} - ${symbol}${maxSalary.toLocaleString()}`;
  }
  const value = minSalary || maxSalary;
  return `${symbol}${value.toLocaleString()}`;
}
