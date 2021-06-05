import getRefs from './get-refs.js';
import API from './fetchCountries.js';

import countryTpl from './country.hbs';

import * as PNotify from '../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';

PNotify.defaultModules.set(PNotifyMobile, {});
import debounce from '../node_modules/lodash.debounce';

const refs = getRefs();
refs.searchForm.addEventListener('input', debounce(onSearch, 500));

function onSearch(event) {
  refs.cardContainer.innerHTML = '';
  const input = event.target;
  const searchQuery = input.value;
  if (!searchQuery) {
    return;
  }
  API.fetchCountries(searchQuery).then(renderCountryCard).catch(onFetchError);
}

function renderCountryCard(country) {
  if (country.status === 404) {
    onFetchError(country.message);
  }
  if (country.length > 10) {
    PNotify.error({
      text: 'Too many matches found. Please enter a more specific query!',
    });
  }
  if (country.length >= 2 && country.length <= 10) {
    makeItems(country);
  }

  if (country.length === 1) {
    makeCountryCard(country);
  }
}

function onFetchError(error) {
  PNotify.error({
    title: 'Oh No!',
    text: `${error}`,
  });
}

function makeItems(items) {
  const itemsMarkup = items.map(item => {
    const itemEl = document.createElement('p');
    itemEl.textContent = item.name;

    return itemEl;
  });

  refs.cardContainer.append(...itemsMarkup);
}

function makeCountryCard(country) {
  const countryMarkup = countryTpl(country);
  refs.cardContainer.insertAdjacentHTML('beforeend', countryMarkup);
}
