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
                content: 'You are a teacher. You teach the child and monitor their activity. You only care about educational content'
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

    } else if (person === 1) {
        const textElement = document.querySelector('#teacher .text');
        typeOutTest(text, textElement)
    } else if (person === 2) {
        const textElement = document.querySelector('#coach .text');
        typeOutTest(text, textElement)
    }
}

const input = document.querySelector('input');
input.addEventListener('keydown', (event) => {
    console.log('keydown');

    if(event.key !== 'Enter') return;
    console.log('enter');

    chatHistory.forEach( async (chat, i) => {
        chat.messages.push({
            role: 'user',
            content: input.value
        });

        // console.log(chat.messages)
        const response = await queryChat(chat.messages, null, 0)

        const data = response.choices[0].message.content

        // console.log(data)
        showTextInPopup(data, i)

    })
})