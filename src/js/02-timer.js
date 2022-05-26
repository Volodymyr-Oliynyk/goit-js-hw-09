import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
  startBtn: document.querySelector('[data-start]'),
  input: document.querySelector('input#datetime-picker'),
};

let intervalId = null;

refs.startBtn.addEventListener('click', onBtnStartClick);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = new Date();
    if (selectedDates[0].getTime() < date.getTime()) {
      refs.startBtn.disabled = true;
      return Notiflix.Notify.warning('Please choose a date in the future');
    } else {
      refs.startBtn.disabled = false;
      clearInterval(intervalId);
    }
  },
};

const pickr = flatpickr(refs.input, options);

function onBtnStartClick() {
  intervalId = setInterval(() => {
    const today = new Date();
    const deadline = pickr.selectedDates[0];
    const delta = deadline.getTime() - today.getTime();
    if (delta < 0) {
      clearInterval(intervalId);
      return;
    }
    const convertedTimerValue = convertMs(delta);
    updateTimerValue(convertedTimerValue);
    refs.startBtn.disabled = true;
  }, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerValue(config) {
  refs.days.textContent = addLeadingZero(config.days);
  refs.hours.textContent = addLeadingZero(config.hours);
  refs.minutes.textContent = addLeadingZero(config.minutes);
  refs.seconds.textContent = addLeadingZero(config.seconds);
}
// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
