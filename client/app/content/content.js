console.log('DeerHacks 3')

const firebaseConfig = {
  apiKey: "AIzaSyCWkD7PrVRJaLbTyCQhAyKuocZmu8sfeFI",
  authDomain: "deerhacks3-ba877.firebaseapp.com",
  projectId: "deerhacks3-ba877",
  storageBucket: "deerhacks3-ba877.appspot.com",
  messagingSenderId: "871649013603",
  appId: "1:871649013603:web:5f929aa1f99ef359c8ad56",
  databaseURL: "https://deerhacks3-ba877-default-rtdb.firebaseio.com",
  measurementId: "G-64Q9H9TYWL"
};

const get_firebase = async (path) => {
  try {
      const response = await fetch(`${firebaseConfig.databaseURL}${path}.json`,{
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      return await response.json()
  }
  catch (e) {
      console.log(e)
      return null
  }

}

const post_firebase = async (path, data) => {
  try {
      const response = await fetch(`${firebaseConfig.databaseURL}${path}.json?`,{
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      })
      return await response.json()
  }
  catch (e) {
      console.log(e)
      return null
  }
}

const get_endpoint = async (endpoint) => {
  try {
      const response = await fetch(`http://127.0.0.1:5000/${endpoint}`,{
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      return await response.json()
  }
  catch (e) {
      console.log(e)
      return null
  }
}

const post_endpoint = async (endpoint, data) => {
  try {
      const response = await fetch(`http://127.0.0.1:5000/${endpoint}`,{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      return await response.json()
  }
  catch (e) {
      console.log(e)
      return null
  }
}

let stop = false
let personas = {
  
  nanny: {
    activeHours: [
      {hour: 22, minute: 0},
      {hour: 8, minute: 0}
    ],
    blackListSites: [
      'https://www.youtube.com/',
      'https://www.facebook.com/',
      'https://www.instagram.com/',
      'https://www.reddit.com/',
    ],
    monitor: true,
    active: true,
  },
  
  teacher: {
    active: true,
    
  },
  
  coach: {
    active: true,

  }

}

// ___________________________________________NANNY______________________________________________________

const isWithinActiveHours = () => {
  const date = new Date()
  const current_hour = date.getHours()
  const current_minute = date.getMinutes()
  
  for (let i = 0; i < personas.nanny.activeHours.length; i++) {
    const activeHour = personas.nanny.activeHours[i]
    if (current_hour === activeHour.hour && current_minute === activeHour.minute) {
      return true
    }
  }
  return false
}

const isBlackListedSite = () => {
  const current_url = window.location.href
  for (let i = 0; i < personas.nanny.blackListSites.length; i++) {
      const blackListSite = personas.nanny.blackListSites[i]
      if (current_url === blackListSite) {
          return true
      }
  }
  return false
}

const saveCurrentSite = async () => {
  const path = '/websites'
  let data = await get_firebase(path)
  if (!data) {data = {sites: []}}
  if (!data.sites) {data.sites = []}
  const current_url = window.location.href
  
  data.sites.push(current_url)

  console.log(data)
  const response = await post_firebase(path, data)

  // if(response) console.log('posted to firebase')
  // else console.log('failed to post to firebase')
}


// ___________________________________________TEACHER______________________________________________________



// ___________________________________________COACH______________________________________________________


let squatCounter = 0;
let isSquatting = false;
const squatThreshold = {upper: 250, lower: 350}; // Adjust these based on your application's scale

//const squatThreshold = {upper: 0.5, lower: 0.7 }; // Adjust these based on your application's scale

// Function to be called with the y position of the shoulders
function updateSquatCounter(shoulder_position) {
  // Example shoulder position: average Y position of left and right shoulder landmarks
  // Normalize shoulderPositionY based on the camera view or pre-defined scale

  // Detect squat start (going down)
  if (shoulder_position[0][1] < squatThreshold.upper && shoulder_position[1][1] < squatThreshold.upper && !isSquatting) {
    isSquatting = true;
  }

  // Detect squat end (coming up)
  if (shoulder_position[0][1] >= squatThreshold.lower && shoulder_position [1][1] >= squatThreshold.lower && isSquatting) {
    squatCounter++;
    isSquatting = false; // Reset the squatting status
    console.log("Squat detected. Total squats: " + squatCounter);
  }

  //console.log(isSquatting);
  //console.log(squatCounter);
}

let pushCounter = 0;
let push = false;
const pushThreshold = {upper: 250, lower: 350}; // Adjust these based on your application's scale

// Function to be called with the y position of the shoulders
function updatePushCounter(shoulder_position) {
  // Example shoulder position: average Y position of left and right shoulder landmarks
  // Normalize shoulderPositionY based on the camera view or pre-defined scale

  // Detect push start (going down)
  if (shoulder_position[0][1] < pushThreshold.upper && shoulder_position[1][1] < pushThreshold.upper && !push) {
    push = true;
  }

  // Detect squat end (coming up)
  if (shoulder_position[0][1] >= pushThreshold.lower && shoulder_position [1][1] >= pushThreshold.lower && push) {
    pushCounter++;
    push = false; // Reset the squatting status
  }
}

let jumpCounter = 0;
let jump = false;
const shoulderThreshold = {upper: 175, lower: 175}; // Adjust these based on your application's scale
const handThreshold = {upper: 175, lower: 250};
function updatejumpCounter(shoulder_position, hand_position) {

  // Detect jumpingjack start (going down)
  if (shoulder_position[0][1] < shoulderThreshold.upper && shoulder_position[1][1] < shoulderThreshold.upper && hand_position[0][1] < handThreshold.upper && hand_position[1][1] < handThreshold.upper && !jump) {
    jump = true;
  }

  // Detect jumpingjack end (coming up)
  if (shoulder_position[0][1] >= shoulderThreshold.lower && shoulder_position [1][1] >= shoulderThreshold.lower && hand_position[0][1] >= handThreshold.lower && hand_position [1][1] >= handThreshold.lower && jump) {
    jumpCounter++;
    jump = false;
  }
}


let curlCounter = 0;
let curl = false;

// curl for left hand
function updatecurlCounter(hand_position, shoulder_position, elbo_position) {

  // Elbo and shoulder
  const mag1 = Math.sqrt(Math.pow((shoulder_position[0][0]- elbo_position[0][0]) , 2) + Math.pow((shoulder_position[0][1] - elbo_position[0][1]), 2))
  
  // Elbo and hand
  const mag2 = Math.sqrt(Math.pow((hand_position[0][0]- elbo_position[0][0]) , 2) + Math.pow((hand_position[0][1] - elbo_position[0][1]), 2))
  
  const dotP = ((shoulder_position[0][0]- elbo_position[0][0]) * (hand_position[0][0]- elbo_position[0][0])) + ((shoulder_position[0][1] - elbo_position[0][1]) * (hand_position[0][1] - elbo_position[0][1]));
  const angle = Math.acos((dotP/ (mag1 * mag2)))

    console.log(angle)
    
    // Detect curl start (going down)
  if (angle > (Math.PI/2) && !curl) {
    curl = true;
  }

  // Detect curl end (coming up)
  if (angle <= (Math.PI/2) && curl) {
    curlCounter++;
    curl = false; // Reset the squatting status
  }
}



const overlay = document.createElement('div')
overlay.className = 'overlay'
const img = document.createElement('img')
const content = document.createElement('div')
content.className = 'content'

const contentTop = document.createElement('div')
contentTop.className = 'content-top'
const contentBottom = document.createElement('div')
contentBottom.className = 'content-bottom'

content.appendChild(contentTop)
content.appendChild(contentBottom)

const main = async () => {
  const openOverlay = async () => {
    overlay.style.opacity = 1
    overlay.style.pointerEvents = 'all'
  }
  const closeOverlay = async () => {
    overlay.style.opacity = 0
    overlay.style.pointerEvents = 'none'
  }
  const startCoachOverlay = async (command, num) => {
    openOverlay()
    jumpCounter = 0
    squatCounter = 0
    pushCounter = 0
    curlCounter = 0
    const loop = setInterval(async () => {

      switch (command) {
      case 'squat':
        contentTop.innerHTML = `Do ${num} Squats`
        contentBottom.innerHTML = `Squats Completed: ${squatCounter}`
        if(squatCounter >= num) {clearInterval(loop);closeOverlay()}
        break
        case 'curl':
          contentTop.innerHTML = `Do ${num} Bicep Curls`
          contentBottom.innerHTML = `Curls Completed: ${curlCounter}`
          if(curlCounter >= num) {clearInterval(loop);closeOverlay()}
      break
      case 'jump':
        contentTop.innerHTML = `Do ${num} Jumping Jacks`
        contentBottom.innerHTML = `Jumping Jacks Completed: ${jumpCounter}`
        if(jumpCounter >= num) {clearInterval(loop);closeOverlay()}
        break
      case 'push':
        contentTop.innerHTML = `Do ${num} Pushups`
        contentBottom.innerHTML = `Pushups Completed: ${pushCounter}`
        if(pushCounter >= num) {clearInterval(loop);closeOverlay()}
        break
      default:
        clearInterval(loop)
        ;closeOverlay()
        break
      }
      }, 200)
  }
  img.src = await chrome.runtime.getURL('app/images/test.gif')
  overlay.appendChild(img)
  overlay.appendChild(content)
  document.body.appendChild(overlay)
  // closeOverlay()
  startCoachOverlay('squat', 10)

    
    let loop = null
    loop = setInterval(async () => {
        // console.log('looping')
        const data = await get_endpoint('get_everything')
        if(!data){return}

        const expression = data.expression
        const shoulder_position = data.shoulder_position
        const hand_position = data.hand_position
        const elbo_position = data.elbo_position
        let stop = false;

        // ___________________________________________NANNY______________________________________________________
        if (personas.nanny.active) {

          const withinActiveHours = isWithinActiveHours()
            const blackListedSite = isBlackListedSite()
    
            if (!withinActiveHours && blackListedSite) {
                console.log('You are on a blacklisted site during active hours')
                window.location.href = 'https://www.google.com/'
            }
    
            if (personas.nanny.monitor) { 
                
            }

        }
        
        // ___________________________________________TEACHER______________________________________________________
        if (personas.teacher.active) {

        }
        
        // ___________________________________________COACH______________________________________________________
        if (personas.coach.active) {
            const test = updateSquatCounter(shoulder_position)
            const test1 = updatePushCounter(shoulder_position)
            const test2 = updatejumpCounter(shoulder_position, hand_position)
            updatecurlCounter(hand_position, shoulder_position, elbo_position)
            //console.log(test)
        }

        if (stop) {clearInterval(loop)}

    },500)
}

main()


const keybind = {
  shift: false,
  button: false,
}

recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

window.addEventListener('keydown', (event) => {if(event.key === 'Shift') keybind.shift = true})
window.addEventListener('keyup', (event) => {if(event.key === 'Shift') keybind.shift = false})
window.addEventListener('keydown', (event) => {if(event.key === 'P'){ 
  if(!keybind.button){
      console.log('starting speech recognition...')
      recognition.start()
  }
  keybind.button = true
}})
window.addEventListener('keyup', (event) => {if(event.key === 'P') {
  keybind.button = false
  console.log('stopping speech recognition...')
  recognition.stop()
}})

let speech = ''
recognition.onresult = function (event) {
  const result = event.results[event.results.length - 1];
  const transcript = result[0].transcript;
  speech = transcript
}
recognition.onend = async function (event) {        
  console.log(speech)

}
