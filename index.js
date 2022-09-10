luxon.Settings.defaultZone = "utc";
const date = document.getElementById('date')
const time = document.getElementById('time')
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


        inputDate = luxon.DateTime.fromObject(
            {year: year, month: month, day: day, hour: hour, minute:minute }, 
            { zone: timezone.value, numberingSystem: 'beng'}
        )
        console.log(inputDate)
    }

    const timesFlags = new Map()
    timezones.forEach(entry => {
        const [flag, tz] = entry.split(':')
        const movedDate = inputDate.setZone(tz).setZone('utc', { keepLocalTime: true }).toMillis()
        if (!timesFlags.has(movedDate)) {
            timesFlags.set(movedDate, new Array())
        }
        timesFlags.get(movedDate).push(flag)
    });
    
    const sortedDates = Array.from(timesFlags.keys()).sort()
    footer.innerHTML = ''

    sortedDates.forEach(milliseconds => {
        const tim = luxon.DateTime.fromMillis(milliseconds)
        const shortTime = tim.setLocale('en-US').toLocaleString(luxon.DateTime.TIME_SIMPLE)
        const flags = timesFlags.get(milliseconds)
        const newText = document.createElement('span')
        newText.className = 'time'
        newText.innerHTML = `${shortTime}&nbsp;${flags.join('')}`.replace(' ', '&nbsp;')
        footer.appendChild(newText)
    });
}

calculateTz()