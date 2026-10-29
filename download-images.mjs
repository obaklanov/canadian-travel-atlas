import fs from 'node:fs/promises';
await fs.mkdir('dist/images',{recursive:true});
const photos={italy:'1701697637411-f5b878978d53',japan:'1493976040374-85c8e12f0c0e',portugal:'1682447448492-682010151fc5',mexico:'1512813195386-6cf811ad3542',thailand:'1528181304800-259b08848526'};
for(const [name,id] of Object.entries(photos)){
 const url=`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1500&q=85`;
 const response=await fetch(url);if(!response.ok)throw Error(name+' HTTP '+response.status);
 await fs.writeFile('dist/images/'+name+'.jpg',Buffer.from(await response.arrayBuffer()));console.log(name,'downloaded');
}
await fs.writeFile('image-sources.json',JSON.stringify(photos,null,2));

