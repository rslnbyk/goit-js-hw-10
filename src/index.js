import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener(
  'input',
  debounce(() => {
    if (!searchInput.value.trim()) {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      return;
    }
    fetchCountries(searchInput.value.trim())
      .then(countries => {
        if (countries.length > 10) {
          countryList.innerHTML = '';
          countryInfo.innerHTML = '';
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (countries.length === 1) {
          countryList.innerHTML = '';
          const markup = countries
            .map(
              el => `<div class="info-container"><img class="flag" src="${
                el.flags.svg
              }" alt="Country flag" />
          <h1>${el.name.official}</h1></div>
          <ul>
          <li class="country-info-item"><p class="country-property">Capital:</p><p>${el.capital.join(
            ', '
          )}</p></li>
          <li class="country-info-item"><p class="country-property">Population:</p><p>${
            el.population
          }</p></li>
          <li class="country-info-item"><p class="country-property">Languages:</p><p>${Object.values(
            el.languages
          ).join(', ')}</p></li>
          </ul>`
            )
            .join('');
          countryInfo.innerHTML = markup;
        } else if (countries.length >= 2 && countries.length <= 10) {
          countryInfo.innerHTML = '';
          const markup = countries
            .map(
              el => `<li class="country-item"><img class="flag" src="${el.flags.svg}" alt="Country flag" />
          <p>${el.name.official}</p></li>`
            )
            .join('');
          countryList.innerHTML = markup;
        }
      })
      .catch(error => {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        Notify.failure(error);
      });
  }, DEBOUNCE_DELAY)
);
