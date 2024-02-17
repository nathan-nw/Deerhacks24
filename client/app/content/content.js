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


const main = async () => {
    
    let loop = null
    loop = setInterval(async () => {
        const data = await get_endpoint('get_everything')
        if(!data){return}

        const expression = data.expression
        const shoulder_position = data.shoulder_position
        
        if (personas.nanny.active) {
        }
        
        if (personas.teacher.active) {
        }
        
        if (personas.coach.active) {
            console.log(data)
        }

        if (stop) {clearInterval(loop)}

    },500)
}

main()