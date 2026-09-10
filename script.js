const GOOGLE_CALENDAR_EMBED_URL = 'https://calendar.google.com/calendar/embed?height=600&wkst=1&mode=MONTH&ctz=Europe%2FLondon&showPrint=0&showTitle=0&showNav=0&showDate=0&showCalendars=0&showTz=0&showTabs=0&bgcolor=%23000000&src=amVubmlmZXJfaHVnaGVzODlAaG90bWFpbC5jb20&src=ZmFtaWx5MTcxOTU3NjY2OTcxMjIzMDU5NDFAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=MmM3N2U5YWE4NjlmYWY4YjBkZTRmMjNkMTJmYjI2M2ZhZmZkOThjMzJkZGVlM2FhNDZlOWZkNjI1MjBmZDI1ZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NDVhN2RiMzQ0ZTY1NmJiYTQ1M2Y4MzMxYTRlZDdkNTJlZDc4YzdhN2ZhNTc4NTA5OTUwOTM1MDhiMmQ0YTgzOUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=OGJmMDRkNjBmYTMwZmFkOGYzNmUwODJlNmRiZGY2N2YwYjgzMGU1NzRhOWZkMjA2NGJmMzk1MjA1NmVmMGJmZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Z2FyZXRoX2h1Z2hlczkwQGhvdG1haWwuY28udWs&src=ZW4udWsjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%238e24aa&color=%233f51b5&color=%23f4511e&color=%233f51b5&color=%2333b679&color=%23795548&color=%230b8043';
const GOOGLE_SLIDES_EMBED_URL = 'https://docs.google.com/presentation/d/1aoQF-MAjRrcTOznp6wsDGbkZw-fn5qhKlWK-GdTGiKI/embed?start=false&loop=false&delayms=3000&rm=minimal';
const GOOGLE_TASKS_URL = 'https://script.google.com/macros/s/AKfycbw0XEnwt9HD7Y3RkmVBFC5BorQCuKhvksRSOlkhmHOMcSWY1OooR1HlrBLsDDS5L2cgWw/exec';
const timeZone = 'Europe/London';
const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=56.0716&longitude=-3.4589&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FLondon&forecast_days=7';
const timeElement = document.querySelector('#local-time');
const dateElement = document.querySelector('#local-date');
const calendarFrame = document.querySelector('.calendar-frame');
const calendarElement = document.querySelector('#google-calendar');
const weatherList = document.querySelector('#weather-list');
const weatherStatus = document.querySelector('#weather-status');
const slidesFrame = document.querySelector('#slides-frame');
const slidesElement = document.querySelector('#google-slides');
const tasksElement = document.querySelector('#google-tasks');

function updateClock() {
	const now = new Date();
	timeElement.textContent = new Intl.DateTimeFormat('en-GB', {
		timeZone,
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	}).format(now);
	dateElement.textContent = new Intl.DateTimeFormat('en-GB', {
		timeZone,
		weekday: 'long',
		day: 'numeric',
		month: 'long'
	}).format(now);
}

function connectCalendar() {
	if (!GOOGLE_CALENDAR_EMBED_URL) return;
	calendarElement.src = GOOGLE_CALENDAR_EMBED_URL;
	calendarFrame.classList.add('connected');
}

function weatherIcon(code) {
	if (code === 0) return '☀';
	if (code <= 3) return '⛅';
	if (code <= 48) return '〰';
	if (code <= 67 || code >= 80) return '☂';
	if (code <= 77) return '❄';
	return '☁';
}

function formatTemperature(value) {
	return `${Math.round(value)}°`;
}

async function updateWeather() {
	try {
		const response = await fetch(weatherUrl);
		if (!response.ok) throw new Error('Weather request failed');
		const forecast = await response.json();
		weatherList.innerHTML = forecast.daily.time.map((date, index) => {
			const day = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone }).format(new Date(`${date}T12:00:00`));
			const isToday = index === 0;
			return `<div class="weather-day${isToday ? ' today' : ''}">
				<span class="weather-day-name">${isToday ? 'Today' : day}</span>
				<span class="weather-icon" aria-hidden="true">${weatherIcon(forecast.daily.weather_code[index])}</span>
				<span class="weather-temperature">${formatTemperature(forecast.daily.temperature_2m_max[index])} / ${formatTemperature(forecast.daily.temperature_2m_min[index])}</span>
				<span class="weather-rain">${forecast.daily.precipitation_probability_max[index]}% rain</span>
			</div>`;
		}).join('');
		weatherStatus.textContent = 'Dunfermline';
	} catch (error) {
		weatherStatus.textContent = 'Unavailable';
		weatherList.innerHTML = '<span class="weather-placeholder">Weather temporarily unavailable</span>';
	}
}

function connectSlides() {
	if (!GOOGLE_SLIDES_EMBED_URL) return;
	loadSlides();
}

function loadSlides() {
	const separator = GOOGLE_SLIDES_EMBED_URL.includes('?') ? '&' : '?';
	slidesElement.src = `${GOOGLE_SLIDES_EMBED_URL}${separator}refresh=${Date.now()}`;
	slidesFrame.classList.add('connected');
}

function connectTasks() {
	if (!GOOGLE_TASKS_URL) return;
	tasksElement.src = GOOGLE_TASKS_URL;
}

updateClock();
connectCalendar();
updateWeather();
connectSlides();
connectTasks();
setInterval(updateClock, 1000);
setInterval(updateWeather, 60 * 60 * 1000);
setInterval(loadSlides, 60 * 60 * 1000);
setInterval(() => window.location.reload(), 60 * 1000);
