<template>
  <q-page>
    <div class="row">
      <div style="max-width: 1920px; width: 100%;">
        <div class="row justify-center">
          <div style="display: flex;width: 100%; max-height: 1080px;">
            <q-calendar
              ref="calendar"
              v-model="selectedDate"
              v-model:model-resources="resources"
              v-model:model-title="titleTasks"
              v-model:model-tasks="parsedTasks"
              v-model:model-footer="footerTasks"
              :mode="selectedCalendar"
              resource-key="id"
              resource-label="name"
              :view="selectedView"
              :day-min-height="70"
              animated
              bordered
              :task-width="240"
              :min-weekday-length="2"
              @change="onChange"
            >
              <template
                v-if="selectedCalendar === 'task'"
                #title-task="{ scope }"
              >
                <div class="summary ellipsis">
                  <div class="title ellipsis">{{ scope.title.label }}</div>
                </div>
              </template>

              <template
                v-if="selectedCalendar === 'task'"
                #head-tasks="{ /* scope */ }"
              >
                <div
                  class="header ellipsis"
                  style="font-weight: 600"
                >
                  <div class="issue ellipsis">Issue</div>
                  <div class="key">Key</div>
                  <div class="logged">Logged</div>
                </div>
              </template>

              <template
                v-if="selectedCalendar === 'task'"
                #task="{ scope }"
              >
                <template
                  v-for="task in getTasks(scope.start, scope.end, scope.task)"
                  :key="task.key"
                >
                  <div class="header ellipsis">
                    <div class="issue ellipsis">
                  <span
                    v-if="scope.task.icon === 'done'"
                    class="done"
                  ><Done/></span>
                      <span
                        v-else-if="scope.task.icon === 'pending'"
                        class="pending"
                      ><Pending/></span>
                      <span
                        v-else-if="scope.task.icon === 'blocking'"
                        class="blocking"
                      ><Blocking/></span>
                      {{ scope.task.title }}
                    </div>
                    <div class="key">{{ scope.task.key }}</div>
                    <div class="logged">{{ sum(scope.start, scope.end, scope.task) }}</div>
                  </div>
                </template>
              </template>

              <template
                v-if="selectedCalendar === 'task'"
                #day="{ scope: { timestamp, task } }"
              >
                <template
                  v-for="time in getLogged(timestamp.date, task.logged)"
                  :key="time"
                >
                  <div class="logged-time">{{ time.logged }}</div>
                </template>
              </template>

              <!-- eslint-disable-next-line vue/valid-v-slot -->
              <template
                v-if="selectedCalendar === 'agenda'"
                #day="{ scope: { timestamp } }"
              >
                <template
                  v-for="a in getAgenda(timestamp)"
                  :key="timestamp.date + a.time"
                >
                  <div
                    :label="a.time"
                    class="justify-start q-ma-sm shadow-5 bg-grey-6"
                    style="margin-top: 25px;"
                  >
                    <div
                      v-if="a.avatar"
                      class="row justify-center"
                      style="margin-top: 30px; width: 100%;"
                    >
                      <q-avatar style="margin-top: -50px; margin-bottom: 10px; font-size: 60px;">
                        <img
                          :src="a.avatar"
                          style="border: #9e9e9e solid 5px;"
                        >
                      </q-avatar>
                    </div>
                    <div class="col-12 q-px-sm">
                      <strong>{{ a.time }}</strong>
                    </div>
                    <div
                      v-if="a.desc"
                      class="col-12 q-px-sm"
                      style="font-size: 10px;"
                    >
                      {{ a.desc }}
                    </div>
                  </div>
                </template>
              </template>

              <template
                v-if="selectedCalendar === 'task'"
                #footer-task="{ scope: { start, end, footer } }"
              >
                <div class="summary ellipsis">
                  <div class="title ellipsis">{{ footer.title }}</div>
                  <div class="total">{{ totals(start, end) }}</div>
                </div>
              </template>

              <template
                v-if="selectedCalendar === 'task'"
                #footer-day="{ scope: { timestamp } }"
              >
                <div class="logged-time">{{ getLoggedSummary(timestamp.date) }}</div>
              </template>
            </q-calendar>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {
  QCalendar,
  today,
  padNumber,
  isBetweenDates,
  parsed
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendar.sass'

import {ref, reactive, computed} from 'vue'
import Holidays from 'date-holidays'

const countries = new Holidays().getCountries()

const selectedDate = ref(today())//"2024-03-22" <- sintaxis para si quieres ver una
console.log(selectedDate)
const selectedMonth = reactive([])
const year = ref(new Date().getFullYear())
const calendar = ref(null)
const country = ref('ES')

const countryCodes = {
  AD: 'ca', // 'Andorra', Catalan
  AE: 'ar', // 'دولة الإمارات العربية المتحدة', Arabic
  AG: 'en', // 'Antigua & Barbuda', English
  AI: 'en', // 'Anguilla', English/Creole
  AL: 'sq', // 'Shqipëri', Albanian
  AM: 'hy', // 'Հայաստան', Armenian
  AO: 'pt', // 'Angola', Potuguese
  AR: 'es-AR', // 'Argentina', Spanish
  AS: 'en-US', // 'American Samoa', American English
  AT: 'de-AT', // 'Österreich', German (Austrian)/Bavarian
  AU: 'en-AU', // 'Australia', Austraian English
  AW: 'nl', // 'Aruba', Dutch
  AX: 'sv-FI', // 'Landskapet Åland', Swedish (finnish)
  AZ: 'az', // 'Azərbaycan Respublikası', Azerbaijani
  BA: 'bs', // 'Bosna i Hercegovina', Bosnian
  BB: 'en', // 'Barbados', English
  BD: 'bn', // 'গণপ্রজাতন্ত্রী বাংলাদেশ', Bengali
  BE: 'nl-BE', // 'Belgique', Ditch (Belgian)
  BF: 'nl', // 'Burkina Faso', Dutch
  BG: 'mk', // 'България', Macedonian
  BH: 'ar', // 'مملكة البحرين', Arabix
  BI: 'fr', // 'République du Burundi', French
  BJ: 'fr', // 'République du Bénin', French
  BL: 'fr', // 'St. Barthélemy', French
  BM: 'en', // 'Bermuda', English
  BN: 'en', // 'Negara Brunei Darussalam', Maylay/English
  BO: 'es-BO', // 'Bolivia', English Bolian
  BQ: 'nl', // Caribisch Nederland', Dutch
  BR: 'pt-BR', // 'Brasil', Portuguese Brazil
  BS: 'bah', // 'Bahamas', Bahamian Creole
  BW: 'tn', // 'Botswana', Setswana
  BY: 'ru', // 'Рэспубліка Беларусь', Russian
  BZ: 'en-BZ', // 'Belize', English Belize
  CA: 'en-CA', // 'Canada',
  CC: 'en', // 'Cocos (Keeling) Islands', Maylay/English
  CD: 'fr', // 'République démocratique du Congo', French
  CF: 'fr', // 'République centrafricaine', French
  CG: 'fr', // 'République du Congo', French
  CH: 'de-LI', // 'Schweiz', German Swiss
  CL: 'es-CL', // 'Chile', Spanish Chile
  CM: 'fr', // 'Cameroun', French
  CN: 'zh', // '中华人民共和国', Mandarin (Chinese)
  CO: 'es-CO', // 'Colombia', Spanish Columbian
  CR: 'es-CR', // 'Costa Rica', Spanish Costa Rica
  CU: 'es-CU', // 'Cuba', Spanish
  CV: 'kea', // 'República de Cabo Verde', Spanish (ISO 693-3)
  CW: 'nl', // 'Curaçao', Dutch
  CX: 'en', // 'Christmas Island', English
  CY: 'el', // 'Κύπρος', Greek
  CZ: 'cs', // 'Česká republika', Czech
  DE: 'de-DE', // 'Deutschland', German Germany
  DK: 'da', // 'Danmark', Danish
  DM: 'fr', // 'Dominica', French
  DO: 'fr', // 'República Dominicana', French
  EC: 'es-EC', // 'Ecuador', Spanish Ecuador
  EE: 'et', // 'Eesti', Estonian
  ES: 'es', // 'España', Spanish
  ET: 'ak', // 'ኢትዮጵያ', Afrikans
  FI: 'fi', // 'Suomi', Finish
  FO: 'de', // 'Føroyar', German
  FR: 'fr', // 'France', French
  GA: 'fr', // 'Gabon', French
  GB: 'en-GB', // 'United Kingdom', English Great Britain
  GD: 'en', // 'Grenada', Englsih
  GE: 'ka', // 'საქართველო', Georgian
  GF: 'fr-GY', // 'Guyane', Grench Guyane
  GG: 'fr', // 'Guernsey', French
  GI: 'es', // 'Gibraltar', Spanish
  GL: 'kl', // 'Kalaallit Nunaat', (ISO 639-1)
  GP: 'fr', // 'Guadeloupe', French
  GQ: 'fr', // 'República de Guinea Ecuatorial', French (Spanish, Portuguese)
  GR: 'el', // 'Ελλάδα', Greek
  GT: 'es-GT', // 'Guatemala', Spanish Guatemala
  GU: 'ch', // 'Guam', Chamorro
  GY: 'en', // 'Guyana', English
  HN: 'es-HN', // 'Honduras', English Honduras
  HR: 'hr', // 'Hrvatska', Croation
  HT: 'ht', // 'Haïti', Haitian
  HU: 'hu', // 'Magyarország', Hungary
  ID: 'hy-AM', // 'Indonesia', Armenian
  IE: 'en-IE', // 'Ireland', English Ireland
  IM: 'en', // 'Isle of Man', English
  IS: 'is', // 'Ísland', Icelandic
  IT: 'it', // 'Italia', Italian
  JE: 'en', // 'Jersey', English
  JM: 'en-JM', // 'Jamaica', English Jamaica
  JP: 'ja', // '日本', Japanese
  KE: 'sw', // 'Kenya', Swahili
  KR: 'ko-KP', // '대한민국', Korean (South)
  LI: 'gsw', // 'Lichtenstein', Swiss German
  LS: 'en', // "'Muso oa Lesotho", English
  LT: 'lt', // 'Lietuva', Lithuanian
  LU: 'fr-LU', // 'Luxembourg', French Luxembourg
  LV: 'lv', // 'Latvija', Latvian
  MC: 'fr-MC', // 'Monaco', French Monaco
  MD: 'mo', // 'Republica Moldova',
  ME: 'bs', // 'Crna Gora', Bosnian
  MG: 'mg', // "Repoblikan'i Madagasikara", Madagascar
  MK: 'mk', // 'Република Македонија', Macedonian
  MQ: 'fr', // 'Martinique', French
  MT: 'mt', // 'Malta', Malta
  MW: 'en', // 'Malawi', English
  MX: 'es-MX', // 'México', Spanish Mexican
  MZ: 'pt', // 'Moçambique', Potuguese
  NA: 'en', // 'Namibia', English (German)
  NI: 'es-NI', // 'Nicaragua', Spanish Nicaragua
  NL: 'nl-NL', // 'Nederland', Dutch Netherlands
  NO: 'no', // 'Norge', Norwegian
  NZ: 'en-NZ', // 'New Zealand', English New Zealand
  PA: 'es', // 'Panamá', Spanish
  PE: 'es-PE', // 'Perú', Spanish Peru
  PH: 'en-PH', // 'Philippines', English Philippines
  PL: 'pl', // 'Polska', Polish
  PT: 'pt', // 'Portugal', Portuguese
  PY: 'gn', // 'Paraguay', Paraguay
  RE: 'fr', // 'Réunion', French
  RO: 'ro', // 'Romania', Romanian
  RS: 'sr', // 'Република Србија', Serbian
  RU: 'ru', // 'Россия', Russian
  RW: 'rw', // "Repubulika y'u Rwanda", Rwanda
  SE: 'sv', // 'Sverige', Swedish
  SG: 'zh-SG', // 'Singapore', Chinese Singapore
  SH: 'en', // 'St. Helena', English
  SI: 'sq', // 'Republika Slovenija', Albanian
  SJ: 'no', // 'Svalbard & Jan Mayen', Norwegian
  SK: 'sk', // 'Slovenská republika', Slovak
  SM: 'it', // 'San Marino', Italian
  SO: 'ar', // 'Jamhuuriyadda Federaalka Soomaaliya', Arabic
  SS: 'en', // 'South Sudan', English
  SV: 'es-SV', // 'El Salvador', Spanish El Salvador
  TG: 'fr', // 'République togolaise', French
  TO: 'to', // 'Puleʻanga Fakatuʻi ʻo Tonga', Tongan
  TR: 'tr', // 'Türkiye', Turkish
  TZ: 'sw', // 'Tanzania', Swahili
  UA: 'uk', // 'Україна', Ukraine
  UG: 'en-UG', // 'Uganda', English Uganda
  US: 'en-US', // 'United States of America', English USA
  UY: 'es-UY', // 'Uruguay', Spanish Uruguay
  VA: 'it', // 'Stato della Città del Vaticano', Italian
  VE: 'es-VE', // 'Venezuela', Spanish Venezuela
  VN: 'vi', // 'Cộng hòa Xã hội chủ nghĩa Việt Nam', Vietnamese
  XK: 'sq', // 'Republika e Kosovës', Albanian
  YT: 'fr', // 'Mayotte', French
  ZA: 'af', // 'South Africa', Afrikaans
  ZM: 'en', // 'Zambia', English
  ZW: 'en' // 'Zimbabwe' English
}

const countriesList = computed(() => {
  return Object.keys(countries).map(key => {
    return {label: countries[key], value: key}
  })
})

const locale = computed(() => {
  if (country.value) {
    return countryCodes[country.value] || 'es-ES'
  }
  return 'es-ES'
})

const formattedMonth = computed(() => {
  const date = new Date(selectedDate.value)
  return new Intl.DateTimeFormat(locale.value, {month: 'long', timeZone: 'UTC'}).format(date) + ' ' + date.getFullYear()
})

const holidaysMap = computed(() => {
  return [
    ...(new Holidays(country.value).getHolidays(year.value - 1)),
    ...(new Holidays(country.value).getHolidays(year.value)),
    ...(new Holidays(country.value).getHolidays(year.value + 1))
  ]
})

function getColor(item) {
  switch (item.type) {
    case 'public':
      return 'blue'
    case 'observance':
      return 'green'
    case 'optional':
      return 'red'
    default: // bank|school
      return 'orange'
  }
}

const eventsMap = computed(() => {
  const map = {}
  if (selectedMonth.length > 0) {
    const start = selectedMonth[0]
    const end = selectedMonth[selectedMonth.length - 1]
    holidaysMap.value
      .filter(item => {
        const timestamp = parseTimestamp((PARSE_DATE.exec(item.date))[0])
        return isBetweenDates(timestamp, start, end)
      })
      .map((item, index) => {
        return {
          id: index,
          title: item.name,
          details: item.type,
          date: (PARSE_DATE.exec(item.date))[0],
          bgcolor: getColor(item)
        }
      })
      .forEach(event => {
        (map[event.date] = (map[event.date] || [])).push(event)
        if (event.days !== undefined) {
          let timestamp = parseTimestamp(event.date)
          let days = event.days
          do {
            timestamp = addToDate(timestamp, {day: 1})
            if (!map[timestamp.date]) {
              map[timestamp.date] = []
            }
            map[timestamp.date].push(event)
          } while (--days > 1)
        }
      })
  }
  return map
})

function badgeClasses(event, type) {
  return {
    [`text-white bg-${event.bgcolor}`]: true,
    'rounded-border': true
  }
}

function badgeStyles(day, event) {
  const s = {}
  // s.left = day.weekday === 0 ? 0 : (day.weekday * parsedCellWidth) + '%'
  // s.top = 0
  // s.bottom = 0
  // s.width = (event.days * parsedCellWidth) + '%'
  return s
}

function onToday() {
  calendar.value.moveToToday()
}

function onPrev() {
  calendar.value.prev()
}

function onNext() {
  calendar.value.next()
}

function onMoved(data) {
  console.log('onMoved', data)
}

function onChange(data) {
  console.log('onChange', data)
  selectedMonth.splice(0, selectedMonth.length, ...data.days)
  for (let index = 0; index < selectedMonth.length; ++index) {
    if (selectedMonth[index].day === 1) {
      year.value = selectedMonth[index].year
      break
    }
  }
}

function onClickDate(data) {
  console.log('onClickDate', data)
}

function onClickDay(data) {
  console.log('onClickDay', data)
}

function onClickWorkweek(data) {
  console.log('onClickWorkweek', data)
}

function onClickHeadDay(data) {
  console.log('onClickHeadDay', data)
}

function onClickHeadWorkweek(data) {
  console.log('onClickHeadWorkweek', data)
}
</script>

<style lang="sass" scoped>
.my-event
  position: relative
  font-size: 12px
  width: 100%
  margin: 1px 0 0 0
  justify-content: center
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.rounded-border
  border-radius: 2px
</style>

