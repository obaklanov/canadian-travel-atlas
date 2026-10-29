// Initial editorial selections; no community votes have been collected.
const communityPicks={
  "thailand": {
    "song": [
      "Doo Ter Tum (Doo Doo Doo)",
      "Job 2 Do",
      "Playful Thai reggae with a memorable chorus."
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
      "Linda Linda",
      "The Blue Hearts",
      "An energetic Japanese punk singalong."
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
      "A Minha Casinha",
      "Xutos & Pontapés",
      "A rousing Portuguese rock singalong."
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
      "La Bamba",
      "Ritchie Valens",
      "An upbeat rock-and-roll version of a traditional Veracruz song; performed by a Mexican-American artist."
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
function communitySection(key){const p=communityPicks[key];return '<section class="community-section"><h2>Voted by community</h2><p class="community-note">Starting selections from the editor. Community voting and proposals are coming later.</p><div class="community-picks">'+[['song','Song to set the mood','Listen on Spotify'],['book','Book for the journey','Explore the book'],['film','Film to spark adventure','Find on Apple TV']].map(([type,label,cta])=>{const [title,creator,description,bookUrl]=p[type];const url=type==='song'?'https://open.spotify.com/search/'+encodeURIComponent(title+' '+creator):type==='film'?'https://tv.apple.com/ca/search?term='+encodeURIComponent(title):bookUrl;return '<article><span class="pick-category">'+label+'</span><h3>'+title+'</h3><p class="pick-creator">'+creator+'</p><p>'+description+'</p><a href="'+url+'" target="_blank" rel="noopener noreferrer">'+cta+' ↗</a></article>';}).join('')+'</div><p class="community-note">Links open licensed platforms or publishers. Availability, subscriptions and purchase options vary by region. These are stories and cultural starting points, rather than factual travel guides.</p></section>';}
