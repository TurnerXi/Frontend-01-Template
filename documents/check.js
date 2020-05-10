var token = "d5c1f4819fe4da9d22e7860c2db0f8e78a5a4815" //�����Լ���token
var arr = []
function doFetch(after){
        var condition = `first: 100`
        if(after){
            condition += `, after: "${after}"`
        }
    
     fetch('https://api.github.com/graphql',{
        method: 'POST',
        mode: 'cors',
        headers:{
            Authorization: `token ${token}`,
        },
        body: JSON.stringify({
            query: `{
              repository(name: "Frontend-01-Template", owner: "GeekUniversity") {
                issues(last: 1, filterBy: {createdBy: "GeekUniversity"}) {
                  nodes {
                    title
                    comments(${condition}) {
                      edges {
                        node {
                          body
                        }
                      }
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                    }
                  }
                }
              }
            }`
        })
    }).then(data=>{
        data.json().then(json=>{
           var comments = json.data.repository.issues.nodes["0"].comments
           arr.push(...comments.edges.map(item=>{
               return item.node.body
           }))

           if(comments.pageInfo.hasNextPage){
                doFetch(comments.pageInfo.endCursor)
           }else{
                doCheck(arr);
           }
        })
    })
 
}

function doCheck(arr){
    for(var i=0;i<arr.length;i++){
       var lines = arr[i].split('\n');
       if(lines.length<5 
        || !/#ѧ��(:|��){1}G\d+/.test(lines[0])
        || !/#����(:|��){1}[^\s][\w\W]+/.test(lines[1])
        || !/#�༶(:|��){1}[^\s][\w\W]+/.test(lines[2])
        || !/#С��(:|��){1}[^\s][\w\W]+/.test(lines[3])
        || !/#��ҵ&�ܽ�����(:|��)[^\s][\w\W]+/.test(lines[4])
        ){
           console.error(arr[i]);
       }else{
           console.log(arr[i]);
       }
    }
}

doFetch();