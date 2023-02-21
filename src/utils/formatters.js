export const transformTime = function(seconds){
		let minutes = parseInt(seconds / 60);
		let seconds_left = seconds - (minutes * 60);

        let hours = parseInt(minutes / 60);
        let minutes_left = minutes - (hours * 60);

		return (hours > 0 ? `${hours}g ${minutes_left}m ${seconds_left}s` : (minutes > 0 ? `${minutes}m ${seconds_left}s` : `${seconds_left}s`));
}
