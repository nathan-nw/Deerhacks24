console.log('DeerHacks 3')

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


let stop = false
let personas = {

    nanny: {
        active: true,
    },
    
    teacher: {
        active: true,
        
    },
    
    coach: {
        active: true,

    }

}


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

  //console.log(push);
  //console.log(pushCounter);
}


let jumpCounter = 0;
let jump = false;
const shoulderThreshold = {upper: 200, lower: 250}; // Adjust these based on your application's scale
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
        
        if (personas.nanny.active) {
        }
        
        if (personas.teacher.active) {
        }
        
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
