function fancyTimeFormat(totalSeconds) {
    // let new_dur = Math.floor(time_dur / 1000);

    // const hour = Math.floor(new_dur / 3600).toString().padStart(2, '0'),
    //     minute = Math.floor(new_dur % 3600 / 60).toString().padStart(2, '0'),
    //     second = Math.floor(new_dur % 60).toString().padStart(2, '0');

    // if (hour > 0) {
    //     return hour + ':' + minute + ':' + second;
    // } else {
    //     return minute + ':' + second;
    // }
    const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

//   return { h: hours, m: minutes, s: seconds };
  if (hours > 0) {
        return hours + ':' + minutes + ':' + seconds;
    } else {
        return minutes + ':' + seconds;
    }
}

export default {
    fancyTimeFormat
};
