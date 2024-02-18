const pp = 'sk-'

const GPT_INFO = {
    GPT_ENDPOINT: "https://api.openai.com/v1/chat/completions",
    GPT_IMAGE_MODAL: "gpt-4-vision-preview",
    GPT_TEXT_MODAL: "gpt-4",
    API_KEY: pp
}

const chatGPT_Image_Query  = async (chatHistory) => {
  console.log('image')
    const response = await fetch(GPT_INFO.GPT_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GPT_INFO.API_KEY}`
        },
        body: JSON.stringify({
            model: GPT_INFO.GPT_IMAGE_MODAL,
            messages: chatHistory,
            max_tokens: 80,
            temperature: 0.75
        })
    })
    return await response.json()
}

const chatGPT_Text_Query  = async (chatHistory) => {
    const response = await fetch(GPT_INFO.GPT_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GPT_INFO.API_KEY}`
        },
        body: JSON.stringify({
            model: GPT_INFO.GPT_TEXT_MODAL,
            messages: chatHistory,
            max_tokens: 80,
            temperature: 0.75
        })
    })
    return await response.json()
}

const queryChat = async (chatHistory, imageData = null, chat_model = 0) => {
    switch (chat_model) {
        case 0:
            if(imageData) return await chatGPT_Image_Query(chatHistory, imageData)
            else return await chatGPT_Text_Query(chatHistory)
        case 1:
            // return await chatGPT_Text_Query(chatHistory, imageData)
        default:
            return 'Invalid chat model'
    }
}

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
    blackListSites: [
      'https://www.ubereats.com/ca',
      'https://www.skipthedishes.com/ca',
    ],
    quotes: [
      'You are stronger than you think',
      'You are capable of anything',
      'You are a winner',
      'You are a champion',
      'Keep going, you are doing great',
      'Only a few more to go',
    ]
  }

}

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
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

const isBlackListedSite = (sites) => {
  const current_url = window.location.href
  for (let i = 0; i < sites.length; i++) {
      const blackListSite = sites[i]
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

    // console.log(angle)
    
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
    img.src = await chrome.runtime.getURL('app/images/coach (1).gif')

    let lastCount = 0
    const voiceNum = 0
    const loop = setInterval(async () => {
      switch (command) {
      case 0:
        contentTop.innerHTML = `Do ${num} Squats`
        contentBottom.innerHTML = `Squats Completed: ${squatCounter}`
        if(squatCounter >= num) {clearInterval(loop);closeOverlay()}
        if(squatCounter > lastCount) {
          lastCount = squatCounter
        }
        break
        case 1:
          contentTop.innerHTML = `Do ${num} Bicep Curls`
          contentBottom.innerHTML = `Curls Completed: ${curlCounter}`
          if(curlCounter >= num) {clearInterval(loop);closeOverlay()}
          if(curlCounter > lastCount) {
            lastCount = curlCounter
          }
      break
      case 2:
        contentTop.innerHTML = `Do ${num} Jumping Jacks`
        contentBottom.innerHTML = `Jumping Jacks Completed: ${jumpCounter}`
        if(jumpCounter >= num) {clearInterval(loop);closeOverlay()}
        if(jumpCounter > lastCount) {
          lastCount = jumpCounter
        }
        break
      case 3:
        contentTop.innerHTML = `Do ${num} Pushups`
        contentBottom.innerHTML = `Pushups Completed: ${pushCounter}`
        if(pushCounter >= num) {clearInterval(loop);closeOverlay()}
        if(pushCounter > lastCount) {
          lastCount = pushCounter
        }
        break
      default:
        clearInterval(loop)
        ;closeOverlay()
        break
      }
      }, 200)
    }
    

      const startNannyOverlay = async (command) => {
        console.log(0)
        openOverlay()
        img.src = await chrome.runtime.getURL('app/images/nanny.gif')
        const contentPic = document.createElement('img')
        switch (command) {
          case 0:
            contentTop.innerHTML = `I know you are angry and it is okay to be.`
            contentBottom.innerHTML = `You should cool down by going for a walk, getting fresh air, or taking a break.`
            break
          case 1:
            contentTop.innerHTML = `I know you are sad but don't worry i'll cheer you up!`
            contentPic.src = await chrome.runtime.getURL('app/images/meme.gif')
            // contentBottom.innerHTML = `I hope you find this meme funny!`
            contentBottom.appendChild(contentPic)
            break
            case 2:
              contentTop.innerHTML = `Looks like you're really happy keep it up!`
              contentPic.src = await chrome.runtime.getURL('app/images/Meme2.gif')
              // contentBottom.innerHTML = `Keep doing what you're doing!`
              contentBottom.appendChild(contentPic)
              break
          default:
            ;closeOverlay()
            break
          
          
        }
      }

  const startTeacherOverlay = async () => {
    openOverlay()
    contentBottom.innerHTML = `Waiting For Response...`
    // const loop = setInterval(async () => {
    //   }, 200)
  }

  img.src = await chrome.runtime.getURL('app/images/test.gif')
  overlay.appendChild(img)
  overlay.appendChild(content)
  document.body.appendChild(overlay)
  closeOverlay()

  window.addEventListener('keydown', (event) => {
    if(event.key === 'Escape') closeOverlay()
  })

  const withinActiveHours = isWithinActiveHours()
  const blackListedSite = isBlackListedSite(personas.nanny.blackListSites)

    if (!withinActiveHours && blackListedSite) {
        console.log('You are on a blacklisted site during active hours')
        window.location.href = 'https://www.google.com/'
    }

    if (personas.nanny.monitor) { 
        
    }


  if (isBlackListedSite(personas.coach.blackListSites)) startCoachOverlay(randomInt(0, 3), randomInt(3, 5))
    
    let loop = null

    const emotion = 5;
    let emotionpop = false;
    let happyCounter = 0;
    let SadCounter = 0;
    let AngryCounter = 0;

    let previousex = null
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
          console.log(expression)
          if(expression === 'sad' && previousex === 'sad') {
            SadCounter++
          } else SadCounter = 0

          if (expression === 'happy' && previousex === 'happy') {
            happyCounter++
          } else happyCounter = 0 
          
          if (expression === 'angry' && previousex === 'angry') {
            AngryCounter++
          } else AngryCounter = 0

          previousex = expression
          if (SadCounter === emotion && !emotionpop) {
            startNannyOverlay(1)
            emotionpop = true
          } else if (happyCounter === emotion && !emotionpop) {
            startNannyOverlay(2)
            emotionpop = true
          } else if (AngryCounter === emotion && !emotionpop) {
            startNannyOverlay(0)
            emotionpop = true
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
    
    
    const cropDataUrl = async (dataUrl, dimensions) => {
        // return promise
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()
            img.src = dataUrl
    
            
            img.onload = () => {
                const img_width = img.width
                const img_height = img.height
                const original_width = window.innerWidth
                const original_height = window.innerHeight
    
                // calculate the ratio of the original image to the window
                const ratio = img_width / original_width
    
                canvas.width = dimensions.width * ratio
                canvas.height = dimensions.height * ratio
                // ctx.drawImage(img, dimensions.x, dimensions.y, dimensions.width, dimensions.height, 0, 0, dimensions.width, dimensions.height)
                ctx.drawImage(img, dimensions.x * ratio, dimensions.y * ratio, dimensions.width * ratio, dimensions.height * ratio, 0, 0, dimensions.width * ratio, dimensions.height* ratio)
                // document.body.appendChild(canvas)
                const dataUrl = canvas.toDataURL('image/png')
                resolve(dataUrl)
            }
    
        })
    
    }
    
    // initialize data and event listeners
    const highlighterMain = async () => {
        let highlight_imageData = null
    
        // __________________________________________PORT FOR SERVICE WORKER__________________________________________
        const port = await chrome.runtime.connect({ name: "content" });
        
        port.onMessage.addListener(async (response) => {
            const execute = await responseHandler(response)
            // console.log(execute)
        });
    
        port.onDisconnect.addListener(() => {
            console.log('Port disconnected')
        })
    
        port.postMessage({ action: 'refresh' });
    
        // __________________________________________RESPONSE HANDLER__________________________________________
        const responseHandler = async (response) => {
            // console.log(response)
            if(response.error) {
                console.error(response.error)
                return
            }
        
            const action = response.action
            const data = response.data
            switch(action) {
                case 'capture':
                    
                    const dataUrl = data.dataUrl
                    const dimensions = data.dimensions
        
                    const croppedImageData = await cropDataUrl(dataUrl, dimensions)
                    highlight_imageData = croppedImageData
                    
                    // testing
                    // const img = document.createElement('img')
                    // img.src = croppedImageData
                    // img.className = 'cropped-image-test'
                    // document.body.appendChild(img)
        
                    // console.log(img)
        
                    break;
        
                case 'refresh':
                    // keeps the service worker actuve
                    setTimeout(() => {
                        port.postMessage({ action: 'refresh' });
                    }, 20000)
                    break;
            }
            
        }
    
        // __________________________________________HIGHLIGHTER__________________________________________
        let highlight = false;
        let h_start = null // this will turn into {x: 0, y: 0} when the user clicks
        let h_end = null // this will turn into {x: 0, y: 0} when the user releases the mouse
        let draw_path = false //represents WHEN the program allows the user to draw
        
        
        // represents if the user wants to draw to highlight or drag to highlight
        let h_path = [] // this will be the path of the highlight element
        let h_query_element = null
    
        const h_bounding_box = { // holds the min and max values of the pencil highlight
            minX: null,
            minY: null,
            maxX: null,
            maxY: null,
        }
    
        const highlight_area = document.createElement('canvas')
        highlight_area.className = 'highlight-area'
        highlight_area.width = window.innerWidth
        highlight_area.height = window.innerHeight
        document.body.appendChild(highlight_area)
    
        const ctx = highlight_area.getContext('2d')
        
        // draws the highlight path
        const drawHighlightPath = async (paths, logo = {x: h_end.x, y: h_end.y}) => {
    
            ctx.clearRect(0, 0, highlight_area.width, highlight_area.height)
            ctx.beginPath()
            
            ctx.lineWidth = 7
            ctx.lineCap = 'round'
    
            const gradient_colours = [
                '#000'
            ]
    
            // Create a linear gradient
            const gradient = ctx.createLinearGradient(0,0, window.innerWidth, window.innerHeight);
    
            gradient_colours.forEach((colour, index) => {
                gradient.addColorStop(index/gradient_colours.length, colour)
            })
    
            // Set the gradient as the stroke style
            ctx.strokeStyle = gradient;
            
            // ctx.moveTo(h_path[0].x, h_path[0].y)
            // h_path.forEach((point, index) => {
            //     // if(index%2 === 0) return
            //     ctx.lineTo(point.x, point.y)
            // })
    
            paths.forEach((path) => {
                if(path.length === 0) return
    
                ctx.moveTo(path[0].x, path[0].y)
                path.forEach((point, index) => {
                    // if(index%2 === 0) return
                    ctx.lineTo(point.x, point.y)
                })
                ctx.stroke()
            })
            
        }
    
        // clears the highlight path
        const clearHighlightPath = () => {
            ctx.clearRect(0, 0, highlight_area.width, highlight_area.height)
        }
    
        let loop = null
        // transforms highlight path into 4 corners
        const transformHighlightPath= () => {
            draw_path = false
            highlight = false
            highlight_area.style.pointerEvents = 'none'
            highlight_area.style.cursor = 'default'
    
            console.log('transforming path')
            const MOVE_STEP = 6 // how fast the points move to the corners
    
            const ANGLE_STEP = Math.PI/100 // how fast the angle changes
            let angle = 0
    
            const BORDER_RADIUS = 20 // the radius of the border
    
            // stores the points that are closest to the corners
            const top_left = []
            const top_right = []
            const bottom_left = []
            const bottom_right = []
    
            // divide the points into the corners
            h_path.forEach((point, index) => {
                const diffMinX = Math.abs(h_bounding_box.minX - point.x)
                const diffMinY = Math.abs(h_bounding_box.minY - point.y)
                const diffMaxX = Math.abs(h_bounding_box.maxX - point.x)
                const diffMaxY = Math.abs(h_bounding_box.maxY - point.y)
    
                // take the smallest difference
                const smallest_x_distance = Math.min(diffMinX, diffMaxX)
                const smallest_y_distance = Math.min(diffMinY, diffMaxY)
    
                if( smallest_x_distance === diffMinX) {
                    if (smallest_y_distance === diffMinY){
                        top_left.push(point)
                    } else {
                        bottom_left.push(point)
                    }
                } else {
                    if (smallest_y_distance === diffMinY){
                        top_right.push(point)
                    } else {
                        bottom_right.push(point)
                    }
                }
            })
    
            clearInterval(loop)
            // move points to the bounding box
            loop = setInterval(async () => {
    
                let count = 0
                let max_length = top_left.length + top_right.length + bottom_left.length + bottom_right.length
                
                top_left.forEach((point, index) => {
                    if(point.x > h_bounding_box.minX) point.x -= MOVE_STEP
                    else{ point.x = h_bounding_box.minX; count++}
    
                    if(point.y > h_bounding_box.minY) point.y -= MOVE_STEP
                    else {point.y = h_bounding_box.minY; count++}
                })
    
                top_right.forEach((point, index) => {
                    if(point.x < h_bounding_box.maxX) point.x += MOVE_STEP
                    else {point.x = h_bounding_box.maxX; count++}
    
                    if(point.y > h_bounding_box.minY) point.y -= MOVE_STEP
                    else {point.y = h_bounding_box.minY; count++}
                })
    
                bottom_left.forEach((point, index) => {
                    if(point.x > h_bounding_box.minX) point.x -= MOVE_STEP
                    else {point.x = h_bounding_box.minX; count++}
    
                    if(point.y < h_bounding_box.maxY) point.y += MOVE_STEP
                    else {point.y = h_bounding_box.maxY; count++}
                })
    
                bottom_right.forEach((point, index) => {
                    if(point.x < h_bounding_box.maxX) point.x += MOVE_STEP
                    else {point.x = h_bounding_box.maxX; count++}
    
                    if(point.y < h_bounding_box.maxY) point.y += MOVE_STEP
                    else {point.y = h_bounding_box.maxY; count++}
                })
    
                const logo = {x: h_bounding_box.maxX, y: h_bounding_box.maxY}
                if(bottom_right.length > 0) {
                    logo.x = bottom_right[0].x
                    logo.y = bottom_right[0].y
                }
    
                drawHighlightPath([top_left, top_right, bottom_left, bottom_right], logo)
    
                if(count === max_length * 2) {
                    if(angle >= Math.PI/4) angle = Math.PI/4
    
                    // draw 1/4 circles in the corners
                    clearHighlightPath()
                    
                    const drawArc = (x, y, radius, startAngle, endAngle, counterClockwise = false) => {
                        ctx.beginPath()
                        ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise)
                        ctx.stroke()
                    }
                    
                    for(let i = 0; i < 4; i++) {
                        if(i == 0){ //top left corner
                            const startAngle = Math.PI + Math.PI/4
                            const endAngle1 = startAngle + angle
                            const endAngle2 = startAngle - angle
    
                            drawArc(h_bounding_box.minX + BORDER_RADIUS, h_bounding_box.minY + BORDER_RADIUS, BORDER_RADIUS, startAngle, endAngle1)
                            drawArc(h_bounding_box.minX + BORDER_RADIUS, h_bounding_box.minY + BORDER_RADIUS, BORDER_RADIUS, startAngle, endAngle2, true)
                           
                        } else if (i == 1) { //top right corner
                            const startAngle = 3 * Math.PI / 2 + Math.PI/4
                            const endAngle1 = startAngle + angle
                            const endAngle2 = startAngle - angle
    
                            drawArc(h_bounding_box.maxX - BORDER_RADIUS, h_bounding_box.minY + BORDER_RADIUS, BORDER_RADIUS, startAngle, endAngle1)
                            drawArc(h_bounding_box.maxX - BORDER_RADIUS, h_bounding_box.minY + BORDER_RADIUS, BORDER_RADIUS, startAngle, endAngle2, true)
    
                        } else if (i == 2) { //bottom left corner
                            const startAngle = Math.PI/2 + Math.PI/4
                            const endAngle1 = startAngle + angle
                            const endAngle2 = startAngle - angle
    
                            drawArc(h_bounding_box.minX + BORDER_RADIUS, h_bounding_box.maxY - BORDER_RADIUS, BORDER_RADIUS, startAngle, endAngle1)
                            drawArc(h_bounding_box.minX + BORDER_RADIUS, h_bounding_box.maxY - BORDER_RADIUS, BORDER_RADIUS, startAngle, endAngle2, true)
                            
                        }
                        else { //bottom right corner
                            const startAngle = 2 * Math.PI + Math.PI/4
                            const endAngle1 = startAngle + angle
                            const endAngle2 = startAngle - angle
                            
                            drawArc(h_bounding_box.maxX- BORDER_RADIUS, h_bounding_box.maxY- BORDER_RADIUS, BORDER_RADIUS, startAngle, endAngle1)
                            drawArc(h_bounding_box.maxX- BORDER_RADIUS, h_bounding_box.maxY- BORDER_RADIUS, BORDER_RADIUS, startAngle, endAngle2, true)
                        }
                        // ctx.stroke()
                    }
    
                    angle += ANGLE_STEP
    
                    // end the loop
                    if(angle >= Math.PI/4) {
                        clearInterval(loop)
    
                        // capture the image
                        const dimensions = {
                            x: h_bounding_box.minX,
                            y: h_bounding_box.minY,
                            width: h_bounding_box.maxX - h_bounding_box.minX,
                            height: h_bounding_box.maxY - h_bounding_box.minY
                        }
                        port.postMessage({ action: 'capture', dimensions: dimensions });
                        
                        let query_x = h_bounding_box.minX - 200
                        if (query_x < 0) query_x = 20
    
                        const query_y = h_bounding_box.minY + (h_bounding_box.maxY - h_bounding_box.minY) / 2
                        h_query_element = createQueryElement(query_x, query_y)
                        document.body.appendChild(h_query_element)
    
                        setTimeout(() => {
                            h_query_element.style.width = '250px'
                            h_query_element.style.opacity = 1
                        }, 100)
    
                        await stop_highlighter()
                    }
    
                }
    
            }, 5)
        }
    
        // creates the query element (highlighter element that allows the user to type in a query)
        const createQueryElement = (x, y) => {
            const queryElement = document.createElement('input')
            queryElement.className = 'highlight-query'
            queryElement.placeholder = 'ask your teacher...'
            queryElement.spellcheck = false
    
            queryElement.style.left = x + 'px'
            queryElement.style.top = y + 'px'
            queryElement.style.opacity = 0
            queryElement.width = '0px'
    
            queryElement.addEventListener('keyup', async (e) => {
                if(e.key === 'Enter') {
                    console.log(queryElement.value)
                    // console.log(highlight_imageData)
                    
                    
                    const chatHistory = [
                      {
                        role: 'system',
                        content: 'You are a teacher, refer to yourself as a teacher. You teach the child and monitor their activity. You only care about educational content'
                      },
                      // use highlight image data in the query
    
                      {
                        role: 'user',
                        content: [
                          {
                            type: 'text',
                            text: queryElement.value
                          },
                          {
                            type: 'image_url',
                            image_url: {
                              url: highlight_imageData
                            }
                          }
                        ]
                      }
    
    
                    ]
                    queryElement.value = ''
    
                    console.log('submitting')
                    startTeacherOverlay()
                    img.src = await chrome.runtime.getURL('app/images/teacher.gif')
    
                    const highlightImg = document.createElement('img')
                    highlightImg.src = highlight_imageData
                    highlightImg.className = 'highlight-img'
                    
                    
                    contentTop.appendChild(highlightImg)
                    chatGPT_Image_Query(chatHistory).then((response) => {
                      const content = response.choices[0].message.content
                      contentBottom.innerHTML = content
                    })

                    close_highlighter()
                }
            })
    
            return queryElement
        }
    
        // removes the query element from DOM
        const clearHighlightQuery = () => {
            if(h_query_element) h_query_element.remove()
        }
    
        // starts the highlighter
        const start_highlighter = (x, y) => {
            draw_path = true
            highlight_area.style.pointerEvents = 'auto'
            highlight_area.style.cursor = 'crosshair'
        }
    
        // stops highlighter drawing
        const stop_highlighter = async () => {
    
            // clear the highlight variables
            highlight = false
    
            h_start = null
            h_end = null
            h_path = []
    
            h_bounding_box.minX = null
            h_bounding_box.minY = null
            h_bounding_box.maxX = null
            h_bounding_box.maxY = null
    
            draw_path = false
     
            highlight_area.style.pointerEvents = 'none'
            highlight_area.style.cursor = 'default'
            // clearHighlightPath()
        }
    
        // close the highlighter
        const close_highlighter = async () => {
            await stop_highlighter()
            clearHighlightPath()
            clearHighlightQuery()
        }
    
        // when the user finishes highlighting 
        const end_highlighter = async () => {
    
            // animates the highlighter path to the corners
            transformHighlightPath()
        }
        
        const init_highlighter = () => {
        
    
            window.addEventListener('resize', async () => {
                highlight_area.width = window.innerWidth
                highlight_area.height = window.innerHeight
                await close_highlighter()
            })
    
            // highlight event listeners
            window.addEventListener('mousedown', async (e) => {
                if(highlight) {
                    // where the highlight starts
                    h_start = { x: e.clientX, y: e.clientY }
                    start_highlighter(h_start.x, h_start.y)
                }
            })
    
            window.addEventListener('mousemove', async (e) => {
                if(highlight && draw_path) {
                    e.preventDefault()
                    // where the highlight ends
                    h_end = { x: e.clientX, y: e.clientY }
    
                    // push the path to the highlight element
                    h_path.push({ x: h_end.x, y: h_end.y })
    
                    // update the line path
                    await drawHighlightPath([h_path])
    
                    // check if the current x or y is less than the min or greater than the max
                    if(h_end.x < h_bounding_box.minX || h_bounding_box.minX == null) h_bounding_box.minX = h_end.x
                    if(h_end.y < h_bounding_box.minY || h_bounding_box.minY == null ) h_bounding_box.minY = h_end.y
                    if(h_end.x > h_bounding_box.maxX || h_bounding_box.maxX == null) h_bounding_box.maxX = h_end.x
                    if(h_end.y > h_bounding_box.maxY || h_bounding_box.maxY == null) h_bounding_box.maxY = h_end.y
    
                    
                }
            })
    
            window.addEventListener('mouseup', async (e) => {
                if(e.button === 2) { // if the user right clicks while highlighting, cancel the highlighter
                    await close_highlighter()
                }
                
                if(highlight && draw_path) {
                    h_end = { x: e.clientX, y: e.clientY }
                    await end_highlighter()
                }
            })
            
            // end highlighter if the user clicks outside the window
            window.addEventListener('blur', async (e) => {
                await close_highlighter()
            })
            
            window.addEventListener('keyup', async (e) => {
                if(e.key === 'Escape') {
                    await close_highlighter()
                }
            })
        }
    
        init_highlighter()
    
        const highlightBtn = document.createElement('button')
        highlightBtn.className = 'highlight-btn'
        highlightBtn.textContent = 'H'
        highlightBtn.onclick = () => {
            // this will begin the highlighter
            close_highlighter()
            highlight = true
            highlight_area.style.pointerEvents = 'auto'
            highlight_area.style.cursor = 'crosshair'
        }
    
        document.body.appendChild(highlightBtn)
    
    }
    highlighterMain()
}

main()

