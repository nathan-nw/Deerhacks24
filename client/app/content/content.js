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

  console.log(isSquatting);
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

  console.log(push);
  //console.log(pushCounter);
}


let jumpCounter = 0;
let jump = false;
const shoulderThreshold = {upper: 200, lower: 350}; // Adjust these based on your application's scale
const handThreshold = {upper: 175, lower: 250};
// Function to be called with the y position of the shoulders
function updatejumpCounter(shoulder_position, hand_position) {
  // Example shoulder position: average Y position of left and right shoulder landmarks
  // Normalize shoulderPositionY based on the camera view or pre-defined scale

  // Detect push start (going down)
  if (shoulder_position[0][1] < shoulderThreshold.upper && shoulder_position[1][1] < shoulderThreshold.upper && hand_position[0][1] < handThreshold.upper && hand_position[1][1] < handThreshold.upper && !jump) {
    jump = true;
  }

  // Detect squat end (coming up)
  if (shoulder_position[0][1] >= shoulderThreshold.lower && shoulder_position [1][1] >= shoulderThreshold.lower && hand_position[0][1] >= handThreshold.lower && hand_position [1][1] >= handThreshold.lower && jump) {
    jumpCounter++;
    jump = false; // Reset the squatting status
  }

  console.log(jump);
  console.log(jumpCounter);
}

const main = async () => {
    
    let loop = null
    loop = setInterval(async () => {
        const data = await get_endpoint('get_everything')
        if(!data){return}

        const expression = data.expression
        const shoulder_position = data.shoulder_position
        const hand_position = data.hand_position
        

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
            console.log(shoulder_position)
            console.log(hand_position)
            const test = updateSquatCounter(shoulder_position)
            const test1 = updatePushCounter(shoulder_position)
            const test2 = updatejumpCounter(shoulder_position, hand_position)
            // console.log(test)
        }

        if (stop) {clearInterval(loop)}

    },500)
}

main()
