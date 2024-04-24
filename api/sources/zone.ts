import { getAllCountries, getTimezonesForCountry } from 'countries-and-timezones';

function getCountriesAndTimezones(): { [country: string]: string[] } {
    const countriesAndTimezones: { [country: string]: string[] } = {};
    const countries = getAllCountries();

    for (const country of Object.keys(countries)) {
        const timezones = getTimezonesForCountry(country);

        if (timezones !== null) {
            countriesAndTimezones[country] = timezones.map((timezone) => timezone.name);
        }
    }

    return countriesAndTimezones;
}

export function getzone(zone:string): string[] {

    const timezones = getTimezonesForCountry(zone);
    // ถ้าต้องการอะไรที่มากกว่าชื่อเมือง
    console.log(timezones)
    if (timezones !== null) {
        return timezones.map((timezone) => timezone.name);
    } else {
        return [];
    }

}

export function getAllzone() {
    const countriesAndTimezones = getCountriesAndTimezones();
    return countriesAndTimezones
}
