//test rate limiting

async function test(){
    console.log("Sending 12 login reqs fast....");

    for(let i=1;i<=12;i++){
        const res = await fetch("http://localhost:5000/api/v2/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: "test@test.com", password: "wrong" })
        });

        console.log(`Request ${i}: ${res.status}`);

        if(res.status === 429){
              const data = await res.json();
            console.log("🚨 RATE LIMITED! Response:", data.message);
        }
    }
}

test();