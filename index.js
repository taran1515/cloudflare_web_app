addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})



const url = "https://cfw-takehome.developers.workers.dev/api/variants";

// This is to handle the request

async function handleRequest(request) {
	let thing =	{ 
		method: 'GET', 
  }
  let urlResponse = {}

  let varriants=[]

  await fetch(url,thing).then(response =>{
    return response.json();
  }).then((data)=>{
    urlResponse=data;
  })
  for(var i=0;i<urlResponse.variants.length;i++)
    {
      varriants[i] = urlResponse.variants[i]
    }

  // OR 
  // if (response.status===200) { 

  //   // Parsing response as JSON
  //   let json = await response.json();
  //   // console.log(json.variants)

  //   for(var i=0;i<json.variants.length;i++)
  //   {
  //     varriants[i] = json.variants[i]
  //   }
  //   // return new Response(arr)
  // } else {
  //   alert("HTTP-Error: " + response.status);
  // }

   let cookie=request.headers.get('Cookie');
   let isNew=false;

   let url_picker=2;  
   let path='url';

   //This is to check if cookies is already present or not
   //If yes then set the url_picker according to the cookie present.

   if (cookie && cookie.includes(`${path}=0`)) {
    url_picker=0;
   } 
   else if (cookie && cookie.includes(`${path}=1`)) {
    url_picker=1;
   } 
   else {
    url_picker = Math.floor(Math.random()*2);
    isNew = true
   }
    
    //Making a new request to one of thw two url stored in variants of array type.

    let newRequest=new Request(varriants[url_picker],{
      method:request.method,
      headers:request.headers
    });

  

  let newResponse = await fetch(newRequest);

  // if response is new i.e there was no cookies present than append the Set cookie header

  if(isNew){

    let newHeaders = new Headers(newResponse.headers);
    newHeaders.append('Set-Cookie',`${path}=${url_picker}`);
    
    newResponse=new Response(newResponse.body, {
      status: newResponse.status,
      statusText: newResponse.statusText,
      headers: newHeaders
    });
  }
    // Customizing the Variant page

    return new HTMLRewriter().on('title', new ElementHandler()).on('h1#title', new ElementHandler())
   .on('p#description', new ElementHandler()).on('a#url', new ElementHandler()).transform(newResponse);
  
}

  

class ElementHandler {
  // check the type of element
  element(element) {
    if(element.tagName=='title'){
      element.setInnerContent('CL Internship Task')
    }
    
    else if(element.getAttribute('id')=='title'){
      element.prepend('Welcome to ')
    }
    
    else if(element.getAttribute('id')=='description'){
      element.prepend("Cloudflare project -  ")
    }
    
    else if(element.getAttribute('id')=='url'){
      element.setAttribute('href','https://github.com/taran1515');
      element.setInnerContent("Go to the Github Profile of Taranjeet Singh");
    }
  }
  
  comments(comment) {

  }

  text(text) {
  }
}

