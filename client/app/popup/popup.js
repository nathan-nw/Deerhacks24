
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

async function changeName(role, name) {

    await fetch('http://127.0.0.1:5000/save_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name:name, role:role}),
    })
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    //     if (data.status === 'ok') {
    //         document.getElementById(role).querySelector('.text').textContent = 'talk to me, ' + name + '!';
    //     } else {
    //         alert(data.message);
    //     }
    // })
    .catch(error => {
        console.error('Error:', error);
    });
}




const getSavedName = async (role) => {
    const data = await get_endpoint('get_everything');
    if (!data) { return null; }

    // Assuming data contains names keyed by role
    switch (role) {
        case 0: return data.nanny_name;
        case 1: return data.coach_name;
        case 2: return data.teacher_name;
        default: return null;
    }
};


const nanny = document.getElementById('nanny')
const coach = document.getElementById('coach')
const teacher = document.getElementById('teacher')
const personaEements = [nanny, coach, teacher]

personaEements.forEach((persona, index)=>{
    console.log(persona)
    const input = persona.querySelector('input')
    input.addEventListener('keydown', (e)=>{
        changeName(index, input.value + e.key)
    })
})