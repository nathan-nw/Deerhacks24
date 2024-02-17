const main = async () => {
    const response = await fetch('http://127.0.0.1:5000/test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: 'test' })
    });
    const data = await response.json();
    console.log(data);
}

main()