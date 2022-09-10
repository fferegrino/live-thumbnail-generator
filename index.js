luxon.Settings.defaultZone = "utc";
const date = document.getElementById('date')
const time = document.getElementById('time')
const hours = document.getElementById('hours')
const dates = document.getElementById('dates')
const timezone = document.getElementById('timezone')
const footer = document.getElementById('footer')


date.addEventListener('change', function() {
    calculateTz()
});
time.addEventListener('change', function() {
    calculateTz()
});
timezone.addEventListener('change', function() {
    calculateTz()
});


const timezones = [
    "🇲🇽:America/Mexico_City",
    "🇨🇴:America/Bogota",
    "🇨🇱:America/Santiago",
    "🇪🇨:America/Guayaquil",
    "🇻🇪:America/Caracas",
    "🇧🇴:America/La_Paz",
    "🇪🇸:Europe/Madrid",
    "🇵🇪:America/Lima",
    "🇵🇾:America/Asuncion",
    "🇦🇷:America/Argentina/Buenos_Aires",
    "🇬🇶:Africa/Malabo",
    "🇨🇷:America/Costa_Rica",
    "🇬🇧:Europe/London",
]


timezones.forEach(entry => {
    const [flag, tz] = entry.split(':')
    const newOption = document.createElement('option');
    newOption.text = `${flag} ${tz}`;
    newOption.value = tz;
    timezone.options.add(newOption)
})

function calculateTz() {
    let inputDate = luxon.DateTime.now();
    if (time.value && date.value && timezone.value) {

        const year = parseInt(date.value.slice(0, 4))
        const month = parseInt(date.value.slice(5, 7))
        const day = parseInt(date.value.slice(8, 10))
        const hour = parseInt(time.value.slice(0, 2))
        const minute = parseInt(time.value.slice(3, 5))


        inputDate = luxon.DateTime.fromObject({
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute
        }, {
            zone: timezone.value
        })
    }

    const timesFlags = new Map()
    timezones.forEach(entry => {
        const [flag, tz] = entry.split(':')
        const movedDate = inputDate.setZone(tz).setZone('utc', {
            keepLocalTime: true
        }).toMillis()
        if (!timesFlags.has(movedDate)) {
            timesFlags.set(movedDate, new Array())
        }
        timesFlags.get(movedDate).push(flag)
    });
    dates.textContent = inputDate.setLocale('es').toLocaleString(luxon.DateTime.DATE_HUGE)
    const sortedDates = Array.from(timesFlags.keys()).sort()
    hours.innerHTML = ''

    sortedDates.forEach(milliseconds => {
        const tim = luxon.DateTime.fromMillis(milliseconds)
        const shortTime = tim.setLocale('en-US').toLocaleString(luxon.DateTime.TIME_SIMPLE)
        const flags = timesFlags.get(milliseconds)
        const newText = document.createElement('span')
        newText.className = 'time'
        newText.innerHTML = `${shortTime}&nbsp;${flags.join('')}`.replace(' ', '&nbsp;')
        hours.appendChild(newText)
    });
}

calculateTz()

var file = document.getElementById('file'); // File refrence


file.addEventListener('change', function() {
    calculateTz()

    var thumbnail = document.getElementById('thumbnail'); // Image reference
    var reader = new FileReader(); // Creating reader instance from FileReader() API
    reader.addEventListener("load", function() { // Setting up base64 URL on image
        thumbnail.src = reader.result;
    }, false);
    reader.readAsDataURL(file.files[0]); // Converting file into data URL
});