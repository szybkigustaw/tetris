export const transformTime = function(seconds){
		let minutes = parseInt(seconds / 60);
		let seconds_left = seconds - (minutes * 60);

		return minutes > 0 ? `${minutes}m ${seconds_left}s` : `${seconds_left}s`;
}
