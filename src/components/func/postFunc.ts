export const calculateTimeDifference = (timePost: Date) => {
    const now = new Date();
    const getTime = new Date(timePost);
    const distance = now.getTime() - getTime.getTime();

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let time = "";
    const month = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    if (distance >= 604800000) {
      return (time += `${getTime.getDate()} ${
        month[getTime.getMonth()]
      } ${getTime.getFullYear()}`);
    } else if (distance >= 86400000 && distance < 604800000) {
      return (time += days + " ngày trước");
    } else if (distance < 86400000 && distance >= 3600000) {
      return (time += hours + " giờ trước");
    } else if (distance < 3600000 && distance >= 60000) {
      return (time += minutes + " phút trước");
    } else {
      return (time += "Mới đây");
    }
};