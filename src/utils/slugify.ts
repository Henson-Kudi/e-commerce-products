import slugifyString from 'slugify';

export default function slugify(
  string: string,
  options: {
    replacement?: string;
    remove?: RegExp;
    lower?: boolean;
    strict?: boolean;
    locale?: string;
    trim?: boolean;
  } = {
    replacement: '-',
    lower: true,
    trim: true,
    remove: /[^\w\s]/g,
  }
): string {
  return slugifyString(string, options);
}
