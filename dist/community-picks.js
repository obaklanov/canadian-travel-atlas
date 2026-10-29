// Book and film links audited 2026-10-29: exact-title pages only. Availability varies by territory.
const verifiedBookExtras={"thailand":[["Google Books","https://books.google.com/books/about/The_Beach.html?id=Gq1PEAAAQBAJ"]],"japan":[["Google Books","https://books.google.com/books/about/Shogun.html?id=cWAF8_uH1_sC"]],"portugal":[["Google Books","https://books.google.com/books?id=FMLFDiIeYyoC"]],"mexico":[["Author’s website","https://luisurrea.com/books/the-hummingbirds-daughter/"]]};
const verifiedFilmLinks={"thailand":[["Prime Video","https://www.primevideo.com/detail/0JKQMRKSNRQNQMMOMCJO3AVM82"]],"japan":[["Official distributor","https://gkids.com/films/spirited-away/"],["Blu-ray / DVD","https://store.gkids.com/collections/spirited-away/products/spirited-away"]],"portugal":[["Prime Video","https://www.primevideo.com/detail/0KZZUKISA9XJ0ZXJNQNHHGBVCY"],["Viewing options","https://www.roku.com/whats-on/movies/night-train-to-lisbon?id=11388fb266865e1296fba3cf5d7b313f"]],"mexico":[["Prime Video","https://www.primevideo.com/detail/0KAFM79I4O8BYHNF7NM1K9EJRL"]]};
// Initial editorial selections; no community votes have been collected.
const communityPicks={
  "thailand": {
    "song": [
      "Phak Kon (2020)",
      "MILLI",
      "A lively Thai rap breakout from the official YUPP! channel.",
      "https://www.youtube.com/watch?v=rUAuEo3t0-o"
    ],
    "book": [
      "The Beach",
      "Alex Garland",
      "A backpacker’s search for paradise becomes a gripping island adventure.",
      "https://www.penguinrandomhouse.com/books/348300/the-beach-by-alex-garland/9781573226523/"
    ],
    "film": [
      "The Beach (2000)",
      "Leonardo DiCaprio · directed by Danny Boyle",
      "A secret beach, a tempting escape and paradise with a darker side."
    ]
  },
  "japan": {
    "song": [
      "Idol (2023)",
      "YOASOBI",
      "High-energy Japanese pop with a globally recognized anime opening.",
      "https://www.youtube.com/watch?v=ZRtdQ81jPUQ"
    ],
    "book": [
      "Shōgun",
      "James Clavell",
      "Shipwreck, rivalry and discovery in a sweeping historical adventure.",
      "https://www.hachette.co.uk/titles/james-clavell/shogun/9780340766163/"
    ],
    "film": [
      "Spirited Away (2001)",
      "Directed by Hayao Miyazaki",
      "A mysterious spirit world and a courageous journey home."
    ]
  },
  "portugal": {
    "song": [
      "Te Amo (2020)",
      "Calema",
      "Warm, rhythmic Portuguese-language pop by the São Toméan duo active in Portugal.",
      "https://www.youtube.com/watch?v=YBMIj1Fj1J4"
    ],
    "book": [
      "Night Train to Lisbon",
      "Pascal Mercier",
      "An impulsive journey to Lisbon unfolds into a search through hidden lives.",
      "https://groveatlantic.com/book/night-train-to-lisbon/"
    ],
    "film": [
      "Night Train to Lisbon (2013)",
      "Jeremy Irons · directed by Bille August",
      "An atmospheric Lisbon mystery about courage, memory and reinvention."
    ]
  },
  "mexico": {
    "song": [
      "1, 2, 3 (2018)",
      "Sofía Reyes feat. Jason Derulo & De La Ghetto",
      "Upbeat bilingual pop led by Mexican singer Sofía Reyes.",
      "https://www.youtube.com/watch?v=p03TIGqEc8o"
    ],
    "book": [
      "The Hummingbird’s Daughter",
      "Luis Alberto Urrea",
      "An epic journey of discovery and upheaval in nineteenth-century Mexico.",
      "https://www.hachette.co.uk/titles/luis-alberto-urrea/the-hummingbirds-daughter/9781529305067/"
    ],
    "film": [
      "Coco (2017)",
      "Disney and Pixar · directed by Lee Unkrich",
      "A colourful musical adventure through family history and the Land of the Dead."
    ]
  }
};

function communitySection(key){
 const p=communityPicks[key];
 return '<section class="community-section"><h2>Set the mood for your trip. Voted by community</h2><div class="community-picks">'+[['song','Song to set the mood'],['book','Book for the journey'],['film','Film to spark adventure']].map(([type,label])=>{
  const [title,creator,description,bookUrl]=p[type];
  const query=encodeURIComponent(title+' '+creator);
  const links=type==='song'?[['Listen on YouTube',p.song[3]],['Spotify','https://open.spotify.com/search/'+query]]:type==='book'?[['Publisher',bookUrl],...verifiedBookExtras[key]]:verifiedFilmLinks[key];
  return '<article><span class="pick-category">'+label.replace(/^(Song|Book|Film)/, '<strong>$1</strong>')+'</span><h3>'+title+'</h3><p class="pick-creator">'+creator+'</p><p>'+description+'</p><div class="resource-links">'+links.map(([text,url])=>'<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+text+' ↗</a>').join('')+'</div></article>';
 }).join('')+'</div></section>';
}
