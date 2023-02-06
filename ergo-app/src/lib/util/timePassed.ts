/**
 * This function takes a date and returns a string representing how long ago that date was.
 * @param date A date string in a format that can be parsed by the Date constructor.
 * @returns A string representing how long ago the date was.
 */
export default function (date: string | null) {
	if (!date) return '';
	const now = new Date();
	const then = new Date(date);

	const minutes = Math.floor((now.getTime() - then.getTime()) / 1000 / 60);
	if (minutes < 1) return 'just now';

	const hours = Math.floor(minutes / 60);
	if (minutes == 1) return '1 minute ago';
	if (hours < 1) return `${minutes} minutes ago`;

	const days = Math.floor(hours / 24);
	if (hours == 1) return '1 hour ago';
	if (days < 1) return `${hours} hours ago`;

	const months = Math.floor(days / 30);
	if (days == 1) return '1 day ago';
	if (months < 1) return `${days} days ago`;

	if (months == 1) return '1 month ago';
	return `${months} months ago`;
}
