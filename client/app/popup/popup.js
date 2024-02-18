const OPENAI_API_KEY = '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'

const GPT_INFO = {
    GPT_ENDPOINT: "https://api.openai.com/v1/chat/completions",
    GPT_IMAGE_MODAL: "gpt-4-vision-preview",
    GPT_TEXT_MODAL: "gpt-4",
    API_KEY: OPENAI_API_KEY
}

const chatGPT_Image_Query  = async (chatHistory, imageData) => {
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

const chatHistory = [
    {
        messages: [
            {
                role: 'system',
                content: 'You are a nanny, refer to yourself as a nanny. you monitor the child\'s activity and block certain websites'
            }
        ]
    },
    {
        messages: [
            {
                role: 'system',
                content: 'You are a teacher, refer to yourself as a teacher. You teach the child and monitor their activity. You only care about educational content'
            }
        ]
    },
    {
        messages: [
            {
                role: 'system',
                content: 'You are a fitness coach. You monitor the child\'s activity and provide feedback as a fitness. You only care about helping me meet my fitness goals.'
            }
        ]
    }
]
/*
const getSavedName = async (role)=>{
    const data = get_endpoint('get_everything')
    if(!data){return null}
    
    if(role === 0){
        return nanny_name
    } else if (role === 1) {
        return coach_name
    } else if (role === 2) {
        return teacher_name
    }
};

const getChatHistory = async (role) =>{
    const name = getSavedName(role)
    chatHistory[role].messages[0].content = `Your name is ${name}. ` + chatHistory[role].messages[0].content
    return chatHistory[role].messages[0].content
};*/


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

const getChatHistory = async (role) => {
    const name = await getSavedName(role); // Now this waits for the name
    if (name) {
        chatHistory[role].messages[0].content = `Your name is ${name}. ` + chatHistory[role].messages[0].content;
    }
    return chatHistory[role];
};

const typeOutTest = (text, textElement) => {
    textElement.innerHTML = ''
    const loop = setInterval(() => {
        if (text.length === 0) {
            clearInterval(loop)
        } else {
            textElement.innerHTML += text[0]
            text = text.slice(1)
        }
    }, 50)
}

const showTextInPopup = (text, person) => {
    if (person === 0){
        const textElement = document.querySelector('#nanny .text');
        typeOutTest(text, textElement)

    } else if (person === 2) {
        const textElement = document.querySelector('#teacher .text');
        typeOutTest(text, textElement)
    } else if (person === 1) {
        const textElement = document.querySelector('#coach .text');
        typeOutTest(text, textElement)
    }
}

const input = document.querySelector('#prompt-input');

/*input.addEventListener('keydown', (event) => {
    console.log('keydown');

    if(event.key !== 'Enter') return;
    console.log('enter');

    chatHistory.forEach( async (chat, i) => {
        chat.messages.push({
            role: 'user',
            content: input.value
        });

        // console.log(chat.messages)
        console.log(getChatHistory(i))
        const response = await queryChat(getChatHistory(i), null, 0)

        const data = response.choices[0].message.content

        // console.log(data)
        showTextInPopup(data, i)

    })
});*/

input.addEventListener('keydown', async (event) => { // Note async keyword here
    if (event.key !== 'Enter') return;

    for (let i = 0; i < chatHistory.length; i++) {
        const chat = await getChatHistory(i); // Await the asynchronous call
        chat.messages.push({
            role: 'user',
            content: input.value
        });

        const response = await queryChat(chat.messages, null, 0); // Make sure to pass the correct argument
        if (response.choices && response.choices.length > 0) {
            const data = response.choices[0].message.content;
            showTextInPopup(data, i);
        }
    }
});

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