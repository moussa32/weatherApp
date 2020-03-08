let timezone = document.querySelector('.location-timezone');
let leftSection = document.querySelector('.location');
let rightSection = document.querySelector('.temperature');
let startDiv = document.querySelector('.start');
let letsStart = document.querySelector('#startButton');
let degree = document.querySelector('.degree');
let windSpeedKH = document.querySelector('.windSpeed');
let humidityPres = document.querySelector('.humidity');
let pressureBar = document.querySelector('.pressure');
let teDesc = document.querySelector('.temperature-description');
let degSection = document.querySelector('.group-section ');
let degSectionSpan = document.querySelector('.group-section  > span');

//Hide content before click start button
toggle(leftSection);
toggle(rightSection);

//Check if start button clicked
letsStart.addEventListener('click', () => {
    let long;
    let lat;

    //Check If geolocation api is availabe on vistor device
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(position => {

            //After 0.6s will hide button and show data
            setTimeout(() => {
                toggle(leftSection);
                toggle(rightSection);

                startDiv.remove();
            }, 600);

            long = position.coords.longitude;
            lat = position.coords.latitude;

            //Proxy to skip CROS
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/80ec4d8a4737d5f8d72427db7ae38a74/${lat},${long}`;

            fetch(api).then(response => {
                    return response.json();
                })
                .then(data => {
                    //Data that want to grab
                    const {
                        temperature,
                        summary,
                        humidity,
                        icon,
                        windSpeed,
                        pressure
                    } = data.currently;

                    //Change Temperature
                    let celsius = Math.floor((temperature - 32) * 5 / 9);

                    //Set DOM elements value
                    degree.textContent = celsius;
                    timezone.textContent = data.timezone;
                    teDesc.textContent = summary;
                    windSpeedKH.textContent = windSpeed;
                    humidityPres.textContent = Math.floor(humidity * 100);
                    pressureBar.textContent = Math.round(pressure / 760 * 100) / 100;

                    //Set Icon
                    setIcons(icon, document.querySelector('.icon'));

                    //Change Temperature to Celsius to Farenhit
                    degSection.addEventListener('click', () => {
                        if (degSectionSpan.textContent === 'F') {
                            degSectionSpan.textContent = 'C';
                            degree.textContent = celsius;
                        } else {
                            degSectionSpan.textContent = 'F';
                            degree.textContent = Math.floor(temperature);
                        }
                    })
                });
        });

    } else {
        document.querySelector('.location-timezone').textContent = 'مش شغال عندك';
    }

    function setIcons(icon, iconID) {
        const skycons = new Skycons({
            color: 'white'
        });
        const currentIcon = icon.replace(/-/g, '_').toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});

//toggle function to show and hide elements
function toggle(x) {
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
