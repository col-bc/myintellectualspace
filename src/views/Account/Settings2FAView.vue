<script setup>
import axios from 'axios'
import { onMounted, reactive } from 'vue'
import NavbarComponent from '../../components/NavbarComponent.vue'
import useUserStore from '../../stores/user'

const userStore = useUserStore()

const data = reactive({
  user: {},
  code: ''
})
const state = reactive({
  step: 0,
  verifyMessage: '',
  enrollError: null,
  verifyError: null
})
onMounted(async () => {
  await userStore.fetchUser()
  data.user = userStore.getUser
})

async function enroll() {
  state.enrollError = null
  if (!data.user.phone || !data.user.phone.match(/^\+?[0-9]{10,15}$/)) {
    state.enrollError = 'Invalid phone number.'
    return
  }
  try {
    const res = await axios.post(
      '/api/auth/2fa/enroll',
      {
        phone: data.user.phone
      },
      {
        headers: {
          Authorization: userStore.getBearerToken
        }
      }
    )
    data.code = ''
    state.step = 1
  } catch (error) {
    state.enrollError = error.response.data.error
  }
}
async function enrollVerify() {
  state.verifyError = null
  try {
    await axios.post(
      '/api/auth/2fa/enroll/verify',
      {
        phone: data.user.phone,
        code: data.code
      },
      {
        headers: {
          Authorization: userStore.getBearerToken
        }
      }
    )
    state.step = 2
    data.user.two_fa_enabled = true
  } catch (error) {
    state.verifyError = error.response.data.error
  }
}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="container flex flex-col mx-auto px-2 py-12">
        <h1
          class="w-full text-3xl mb-6 font-bold text-gray-900 dark:text-white"
        >
          2-Factor Authentication
        </h1>
        <p class="text-gray-800 text-base leading-tight mb-12 dark:text-white">
          2-Factor Authentication is an extra layer of security for your
          account. It requires you to provide both you password and a code send
          to your phone.
        </p>
        <div class="flex flex-col md:flex-row items-start mb-12">
          <div v-if="!data.user.two_fa_enabled" class="flex-1">
            <form
              v-if="state.step === 0"
              @submit.prevent="enroll()"
              class="p-4 w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 space-y-6"
            >
              <div
                v-if="state.enrollError"
                class="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                role="alert"
              >
                <span class="font-medium">{{ state.enrollError }}</span>
              </div>
              <div>
                <label
                  class="block text-gray-700 dark:text-white text-sm font-bold mb-2"
                >
                  Phone Number
                </label>
                <div class="flex">
                  <select
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 inline-flex w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="1">USA (+1)</option>
                    <optgroup label="Other countries">
                      <option value="213">Algeria (+213)</option>
                      <option value="376">Andorra (+376)</option>
                      <option value="244">Angola (+244)</option>
                      <option value="1264">Anguilla (+1264)</option>
                      <option value="1268">
                        Antigua &amp; Barbuda (+1268)
                      </option>
                      <option value="54">Argentina (+54)</option>
                      <option value="374">Armenia (+374)</option>
                      <option value="297">Aruba (+297)</option>
                      <option value="61">Australia (+61)</option>
                      <option value="43">Austria (+43)</option>
                      <option value="994">Azerbaijan (+994)</option>
                      <option value="1242">Bahamas (+1242)</option>
                      <option value="973">Bahrain (+973)</option>
                      <option value="880">Bangladesh (+880)</option>
                      <option value="1246">Barbados (+1246)</option>
                      <option value="375">Belarus (+375)</option>
                      <option value="32">Belgium (+32)</option>
                      <option value="501">Belize (+501)</option>
                      <option value="229">Benin (+229)</option>
                      <option value="1441">Bermuda (+1441)</option>
                      <option value="975">Bhutan (+975)</option>
                      <option value="591">Bolivia (+591)</option>
                      <option value="387">Bosnia Herzegovina (+387)</option>
                      <option value="267">Botswana (+267)</option>
                      <option value="55">Brazil (+55)</option>
                      <option value="673">Brunei (+673)</option>
                      <option value="359">Bulgaria (+359)</option>
                      <option value="226">Burkina Faso (+226)</option>
                      <option value="257">Burundi (+257)</option>
                      <option value="855">Cambodia (+855)</option>
                      <option value="237">Cameroon (+237)</option>
                      <option value="1">Canada (+1)</option>
                      <option value="238">Cape Verde Islands (+238)</option>
                      <option value="1345">Cayman Islands (+1345)</option>
                      <option value="236">
                        Central African Republic (+236)
                      </option>
                      <option value="56">Chile (+56)</option>
                      <option value="86">China (+86)</option>
                      <option value="57">Colombia (+57)</option>
                      <option value="269">Comoros (+269)</option>
                      <option value="242">Congo (+242)</option>
                      <option value="682">Cook Islands (+682)</option>
                      <option value="506">Costa Rica (+506)</option>
                      <option value="385">Croatia (+385)</option>
                      <option value="53">Cuba (+53)</option>
                      <option value="90392">Cyprus North (+90392)</option>
                      <option value="357">Cyprus South (+357)</option>
                      <option value="42">Czech Republic (+42)</option>
                      <option value="45">Denmark (+45)</option>
                      <option value="253">Djibouti (+253)</option>
                      <option value="1809">Dominica (+1809)</option>
                      <option value="1809">Dominican Republic (+1809)</option>
                      <option value="593">Ecuador (+593)</option>
                      <option value="20">Egypt (+20)</option>
                      <option value="503">El Salvador (+503)</option>
                      <option value="240">Equatorial Guinea (+240)</option>
                      <option value="291">Eritrea (+291)</option>
                      <option value="372">Estonia (+372)</option>
                      <option value="251">Ethiopia (+251)</option>
                      <option value="500">Falkland Islands (+500)</option>
                      <option value="298">Faroe Islands (+298)</option>
                      <option value="679">Fiji (+679)</option>
                      <option value="358">Finland (+358)</option>
                      <option value="33">France (+33)</option>
                      <option value="594">French Guiana (+594)</option>
                      <option value="689">French Polynesia (+689)</option>
                      <option value="241">Gabon (+241)</option>
                      <option value="220">Gambia (+220)</option>
                      <option value="7880">Georgia (+7880)</option>
                      <option value="49">Germany (+49)</option>
                      <option value="233">Ghana (+233)</option>
                      <option value="350">Gibraltar (+350)</option>
                      <option value="30">Greece (+30)</option>
                      <option value="299">Greenland (+299)</option>
                      <option value="1473">Grenada (+1473)</option>
                      <option value="590">Guadeloupe (+590)</option>
                      <option value="671">Guam (+671)</option>
                      <option value="502">Guatemala (+502)</option>
                      <option value="224">Guinea (+224)</option>
                      <option value="245">Guinea - Bissau (+245)</option>
                      <option value="592">Guyana (+592)</option>
                      <option value="509">Haiti (+509)</option>
                      <option value="504">Honduras (+504)</option>
                      <option value="852">Hong Kong (+852)</option>
                      <option value="36">Hungary (+36)</option>
                      <option value="354">Iceland (+354)</option>
                      <option value="91">India (+91)</option>
                      <option value="62">Indonesia (+62)</option>
                      <option value="98">Iran (+98)</option>
                      <option value="964">Iraq (+964)</option>
                      <option value="353">Ireland (+353)</option>
                      <option value="972">Israel (+972)</option>
                      <option value="39">Italy (+39)</option>
                      <option value="1876">Jamaica (+1876)</option>
                      <option value="81">Japan (+81)</option>
                      <option value="962">Jordan (+962)</option>
                      <option value="7">Kazakhstan (+7)</option>
                      <option value="254">Kenya (+254)</option>
                      <option value="686">Kiribati (+686)</option>
                      <option value="850">Korea North (+850)</option>
                      <option value="82">Korea South (+82)</option>
                      <option value="965">Kuwait (+965)</option>
                      <option value="996">Kyrgyzstan (+996)</option>
                      <option value="856">Laos (+856)</option>
                      <option value="371">Latvia (+371)</option>
                      <option value="961">Lebanon (+961)</option>
                      <option value="266">Lesotho (+266)</option>
                      <option value="231">Liberia (+231)</option>
                      <option value="218">Libya (+218)</option>
                      <option value="417">Liechtenstein (+417)</option>
                      <option value="370">Lithuania (+370)</option>
                      <option value="352">Luxembourg (+352)</option>
                      <option value="853">Macao (+853)</option>
                      <option value="389">Macedonia (+389)</option>
                      <option value="261">Madagascar (+261)</option>
                      <option value="265">Malawi (+265)</option>
                      <option value="60">Malaysia (+60)</option>
                      <option value="960">Maldives (+960)</option>
                      <option value="223">Mali (+223)</option>
                      <option value="356">Malta (+356)</option>
                      <option value="692">Marshall Islands (+692)</option>
                      <option value="596">Martinique (+596)</option>
                      <option value="222">Mauritania (+222)</option>
                      <option value="269">Mayotte (+269)</option>
                      <option value="52">Mexico (+52)</option>
                      <option value="691">Micronesia (+691)</option>
                      <option value="373">Moldova (+373)</option>
                      <option value="377">Monaco (+377)</option>
                      <option value="976">Mongolia (+976)</option>
                      <option value="1664">Montserrat (+1664)</option>
                      <option value="212">Morocco (+212)</option>
                      <option value="258">Mozambique (+258)</option>
                      <option value="95">Myanmar (+95)</option>
                      <option value="264">Namibia (+264)</option>
                      <option value="674">Nauru (+674)</option>
                      <option value="977">Nepal (+977)</option>
                      <option value="31">Netherlands (+31)</option>
                      <option value="687">New Caledonia (+687)</option>
                      <option value="64">New Zealand (+64)</option>
                      <option value="505">Nicaragua (+505)</option>
                      <option value="227">Niger (+227)</option>
                      <option value="234">Nigeria (+234)</option>
                      <option value="683">Niue (+683)</option>
                      <option value="672">Norfolk Islands (+672)</option>
                      <option value="670">Northern Marianas (+670)</option>
                      <option value="47">Norway (+47)</option>
                      <option value="968">Oman (+968)</option>
                      <option value="680">Palau (+680)</option>
                      <option value="507">Panama (+507)</option>
                      <option value="675">Papua New Guinea (+675)</option>
                      <option value="595">Paraguay (+595)</option>
                      <option value="51">Peru (+51)</option>
                      <option value="63">Philippines (+63)</option>
                      <option value="48">Poland (+48)</option>
                      <option value="351">Portugal (+351)</option>
                      <option value="1787">Puerto Rico (+1787)</option>
                      <option value="974">Qatar (+974)</option>
                      <option value="262">Reunion (+262)</option>
                      <option value="40">Romania (+40)</option>
                      <option value="7">Russia (+7)</option>
                      <option value="250">Rwanda (+250)</option>
                      <option value="378">San Marino (+378)</option>
                      <option value="239">
                        Sao Tome &amp; Principe (+239)
                      </option>
                      <option value="966">Saudi Arabia (+966)</option>
                      <option value="221">Senegal (+221)</option>
                      <option value="381">Serbia (+381)</option>
                      <option value="248">Seychelles (+248)</option>
                      <option value="232">Sierra Leone (+232)</option>
                      <option value="65">Singapore (+65)</option>
                      <option value="421">Slovak Republic (+421)</option>
                      <option value="386">Slovenia (+386)</option>
                      <option value="677">Solomon Islands (+677)</option>
                      <option value="252">Somalia (+252)</option>
                      <option value="27">South Africa (+27)</option>
                      <option value="34">Spain (+34)</option>
                      <option value="94">Sri Lanka (+94)</option>
                      <option value="290">St. Helena (+290)</option>
                      <option value="1869">St. Kitts (+1869)</option>
                      <option value="1758">St. Lucia (+1758)</option>
                      <option value="249">Sudan (+249)</option>
                      <option value="597">Suriname (+597)</option>
                      <option value="268">Swaziland (+268)</option>
                      <option value="46">Sweden (+46)</option>
                      <option value="41">Switzerland (+41)</option>
                      <option value="963">Syria (+963)</option>
                      <option value="886">Taiwan (+886)</option>
                      <option value="7">Tajikstan (+7)</option>
                      <option value="66">Thailand (+66)</option>
                      <option value="228">Togo (+228)</option>
                      <option value="676">Tonga (+676)</option>
                      <option value="1868">
                        Trinidad &amp; Tobago (+1868)
                      </option>
                      <option value="216">Tunisia (+216)</option>
                      <option value="90">Turkey (+90)</option>
                      <option value="7">Turkmenistan (+7)</option>
                      <option value="993">Turkmenistan (+993)</option>
                      <option value="1649">
                        Turks &amp; Caicos Islands (+1649)
                      </option>
                      <option value="688">Tuvalu (+688)</option>
                      <option value="256">Uganda (+256)</option>
                      <!-- <option value="44">UK (+44)</option> -->
                      <option value="380">Ukraine (+380)</option>
                      <option value="971">United Arab Emirates (+971)</option>
                      <option value="598">Uruguay (+598)</option>
                      <!-- <option value="1">USA (+1)</option> -->
                      <option value="7">Uzbekistan (+7)</option>
                      <option value="678">Vanuatu (+678)</option>
                      <option value="379">Vatican City (+379)</option>
                      <option value="58">Venezuela (+58)</option>
                      <option value="84">Vietnam (+84)</option>
                      <option value="84">
                        Virgin Islands - British (+1284)
                      </option>
                      <option value="84">Virgin Islands - US (+1340)</option>
                      <option value="681">Wallis &amp; Futuna (+681)</option>
                      <option value="969">Yemen (North)(+969)</option>
                      <option value="967">Yemen (South)(+967)</option>
                      <option value="260">Zambia (+260)</option>
                      <option value="263">Zimbabwe (+263)</option>
                    </optgroup>
                  </select>
                  <input
                    type="tel"
                    v-model="data.user.phone"
                    class="flex-1 bg-white border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Changing you phone number here will update it for your
                  account.
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Start Enrollment
                </button>
              </div>
            </form>
            <form
              v-if="state.step === 1"
              @submit.prevent="enrollVerify()"
              class="p-4 w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 space-y-6"
            >
              <div
                v-if="state.verifyError"
                class="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                role="alert"
              >
                <span class="font-medium">{{ state.verifyError }}</span>
              </div>
              <div>
                <label
                  class="block text-gray-700 dark:text-white text-sm font-bold mb-2"
                >
                  Verify Code
                </label>
                <input
                  type="number"
                  v-model="data.code"
                  placeholder="######"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ state.verifyMessage }}
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Verify
                </button>
                <button
                  type="button"
                  @click="state.step = 0"
                  class="py-2.5 px-5 ml-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
            <div
              v-if="state.step === 2"
              class="p-4 w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8 dark:bg-gray-800 dark:text-white dark:border-gray-700 space-y-6"
            >
              2-Factor Authentication is now enabled for your account.
            </div>
          </div>
          <div v-if="data.user.two_fa_enabled" class="flex-1 mb-12">
            <div
              class="p-4 w-full max-w-md bg-white text-gray-800 rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8 dark:text-white dark:bg-gray-800 dark:border-gray-700 space-y-6"
            >
              <p class="mb-4">
                2-Factor Authentication is enabled for your account.
              </p>
              <button
                type="button"
                class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Disable 2FA
              </button>
            </div>
          </div>
          <div
            class="flex-1 flex flex-col justify-center gap-6 text-gray-700 dark:text-gray-200 sm:mb-12"
          >
            <h4 class="text-gray-800 dark:text-white text-lg font-bold">
              How it Works
            </h4>
            <div class="flex items-start gap-6">
              <span
                class="flex-shrink-0 px-5 py-2.5 bg-blue-200 text-blue-800 rounded-full text-xl font-bold dark:bg-blue-600 dark:text-white"
                >STEP 1</span
              >
              <p>
                You login using your existing email and password combination
              </p>
            </div>
            <div class="flex items-start gap-6">
              <span
                class="flex-shrink-0 px-5 py-2.5 bg-blue-200 text-blue-800 rounded-full text-xl font-bold dark:bg-blue-600 dark:text-white"
                >STEP 2</span
              >
              <div>
                <p>You get a text message with a 6 digit code</p>
              </div>
            </div>
            <div class="flex items-start gap-6">
              <span
                class="flex-shrink-0 px-5 py-2.5 bg-blue-200 text-blue-800 rounded-full text-xl font-bold dark:bg-blue-600 dark:text-white"
                >STEP 3</span
              >
              <div>
                <p>You verify the code and continue to you account.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
