import fs from 'node:fs/promises';
await fs.mkdir('dist/images',{recursive:true});
const photos={"egypt":"1632836388763-3a52d354cd7e","new-zealand":"1581512576584-04a880f0c007",argentina:'1552751753-0fc84ae5b6c8',italy:'1701697637411-f5b878978d53',japan:'1493976040374-85c8e12f0c0e',portugal:'1682447448492-682010151fc5',mexico:'1676381514993-7a9885e81b11',thailand:'1528181304800-259b08848526'};
for(const [name,id] of Object.entries(photos)){
 const url=`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1500&q=85`;
 const response=await fetch(url);if(!response.ok)throw Error(name+' HTTP '+response.status);
 await fs.writeFile('dist/images/'+name+'.jpg',Buffer.from(await response.arrayBuffer()));console.log(name,'downloaded');
}
await fs.writeFile('image-sources.json',JSON.stringify(photos,null,2));

