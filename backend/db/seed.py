"""
Meme Genie Database Seeder
Contains 25 iconic memes across various eras, formats, and categories.
"""

INITIAL_MEMES = [
    {
        "id": "rickroll",
        "name": "Rickroll (Never Gonna Give You Up)",
        "quotes": ["Never gonna give you up", "Never gonna let you down"],
        "tags": ["music", "old", "troll", "global", "dialogue", "real_person", "classic"],
        "era": "2000s",
        "region": "global",
        "format": "video",
        "media_url": "https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif",
        "description": "Rick Astley's iconic 1987 music video used as the ultimate bait-and-switch internet prank."
    },
    {
        "id": "distracted_bf",
        "name": "Distracted Boyfriend",
        "quotes": ["Looking back", "Jealous girlfriend"],
        "tags": ["global", "stock_photo", "relationship", "real_person", "reaction_face"],
        "era": "2010s",
        "region": "global",
        "format": "image",
        "media_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop",
        "description": "Stock photo of a man looking at another woman while his girlfriend looks at him in disapproval."
    },
    {
        "id": "doge",
        "name": "Doge (Kabochan)",
        "quotes": ["Much wow", "Very meme", "So amaze"],
        "tags": ["animal", "dog", "wholesome", "global", "old", "classic"],
        "era": "2010s",
        "region": "global",
        "format": "image",
        "media_url": "https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg",
        "description": "Shiba Inu dog named Kabosu surrounded by colorful comic sans text."
    },
    {
        "id": "gigachad",
        "name": "Gigachad (Ernest Khalimov)",
        "quotes": ["Average Enjoyer", "Yes."],
        "tags": ["masculine", "fitness", "real_person", "global", "troll"],
        "era": "2020s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/026/152/gigachad.jpg",
        "description": "Ultra-muscular, jawline-defined masculine archetype symbolizing confidence."
    },
    {
        "id": "drake_hotline",
        "name": "Drake Hotline Bling (Nah / Yeah)",
        "quotes": ["No thanks", "Yes please"],
        "tags": ["music", "real_person", "reaction_face", "global", "comparison"],
        "era": "2010s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/019/649/Drake_Hotline_Bling.jpg",
        "description": "Drake turning away in disapproval versus Drake smiling in agreement."
    },
    {
        "id": "woman_yelling_cat",
        "name": "Woman Yelling at a Cat",
        "quotes": ["Me explaining...", "The cat just eating salad"],
        "tags": ["animal", "cat", "dialogue", "real_person", "reaction_face", "global"],
        "era": "2010s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/031/015/cover5.jpg",
        "description": "Real Housewives star crying and pointing paired with Smudge the confused white cat."
    },
    {
        "id": "coffin_dance",
        "name": "Coffin Dance (Dancing Pallbearers)",
        "quotes": ["Astronomia", "Press F"],
        "tags": ["music", "dance", "real_person", "global", "dark_humor"],
        "era": "2020s",
        "region": "africa",
        "format": "video",
        "media_url": "https://media.giphy.com/media/j6uK36y55ZjUI/giphy.gif",
        "description": "Ghanaian pallbearers dancing while carrying a coffin accompanied by EDM music."
    },
    {
        "id": "roll_safe",
        "name": "Roll Safe (Think About It)",
        "quotes": ["You can't lose if you don't play", "Smart move"],
        "tags": ["dialogue", "real_person", "reaction_face", "global", "sarcasm"],
        "era": "2010s",
        "region": "uk",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/022/138/highres.jpg",
        "description": "Kayode Ewumi tapping his temple with a smirk indicating questionable wisdom."
    },
    {
        "id": "fine_dog",
        "name": "This is Fine (Question Hound)",
        "quotes": ["This is fine", "I'm okay with the events that are unfolding"],
        "tags": ["cartoon", "animal", "dog", "relatable", "sarcasm", "global"],
        "era": "2010s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/018/012/this_is_fine.jpeg",
        "description": "A cartoon dog sitting calmly in a room engulfed by flames while sipping coffee."
    },
    {
        "id": "pepe_the_frog",
        "name": "Pepe the Frog",
        "quotes": ["Feels good man", "Feels bad man"],
        "tags": ["cartoon", "animal", "old", "troll", "global", "classic"],
        "era": "2000s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/000/018/pepe.jpg",
        "description": "Anthropomorphic green frog comic character with iconic expressive faces."
    },
    {
        "id": "success_kid",
        "name": "Success Kid",
        "quotes": ["Nailed it", "Victory"],
        "tags": ["wholesome", "real_person", "old", "classic", "global"],
        "era": "2000s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/000/067/swug.jpg",
        "description": "Toddler on a beach clenching his fist with a determined facial expression."
    },
    {
        "id": "change_my_mind",
        "name": "Change My Mind (Steven Crowder)",
        "quotes": ["Prove me wrong", "Change my mind"],
        "tags": ["dialogue", "real_person", "global", "debate"],
        "era": "2010s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/025/460/changemymind.jpg",
        "description": "Man sitting behind a sign outside a university campus inviting debates."
    },
    {
        "id": "trade_offer",
        "name": "Trade Offer (Bradeasy)",
        "quotes": ["I receive...", "You receive..."],
        "tags": ["gaming", "relatable", "real_person", "dialogue", "global"],
        "era": "2020s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/036/838/cover5.jpg",
        "description": "TikTok creator dressed in a suit making an unbalanced business proposition."
    },
    {
        "id": "grumpy_cat",
        "name": "Grumpy Cat (Tardar Sauce)",
        "quotes": ["NO", "I hated it"],
        "tags": ["animal", "cat", "old", "classic", "global", "reaction_face"],
        "era": "2010s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/011/365/GrumpyCat.jpg",
        "description": "Snowshoe cat permanently frowning due to feline dwarfism."
    },
    {
        "id": "surprised_pikachu",
        "name": "Surprised Pikachu",
        "quotes": ["*gasp*", "Who could have predicted this?"],
        "tags": ["cartoon", "gaming", "anime", "reaction_face", "sarcasm", "global"],
        "era": "2010s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/027/475/pikachu.jpg",
        "description": "Screenshot of Pikachu from the Pokémon anime with its mouth agape in mock surprise."
    },
    {
        "id": "disaster_girl",
        "name": "Disaster Girl",
        "quotes": ["Everything is according to plan", "Muahaha"],
        "tags": ["real_person", "troll", "dark_humor", "old", "classic", "global"],
        "era": "2000s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/000/043/disastergirl.jpg",
        "description": "Young girl smirking mischievously while a house burns in the background."
    },
    {
        "id": "nyan_cat",
        "name": "Nyan Cat",
        "quotes": ["Nyan nyan nyan", "Rainbow trail"],
        "tags": ["music", "cartoon", "animal", "cat", "old", "classic", "global"],
        "era": "2010s",
        "region": "global",
        "format": "video",
        "media_url": "https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif",
        "description": "8-bit pop-tart cat flying through space leaving a rainbow trail set to upbeat Japanese music."
    },
    {
        "id": "giga_chad_doge",
        "name": "Swole Doge vs. Cheems",
        "quotes": ["Buff Doge back in the day", "Cheems crying today"],
        "tags": ["animal", "dog", "comparison", "gaming", "global"],
        "era": "2020s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/034/193/cover1.jpg",
        "description": "Muscular Swole Doge contrasted against small slouching Cheems."
    },
    {
        "id": "bad_luck_brian",
        "name": "Bad Luck Brian",
        "quotes": ["Takes driving test...", "Gets hit by a bus"],
        "tags": ["real_person", "old", "classic", "relatable", "global"],
        "era": "2010s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/009/168/brian.jpg",
        "description": "Yearbook photo of a blonde guy with braces wearing a plaid sweater vest."
    },
    {
        "id": "one_does_not_simply",
        "name": "One Does Not Simply Walk Into Mordor",
        "quotes": ["One does not simply...", "Mordor"],
        "tags": ["dialogue", "real_person", "old", "classic", "global", "movie"],
        "era": "2000s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/002/831/onedoesnotsimply.jpg",
        "description": "Boromir from Lord of the Rings gesturing with his hand while making a serious point."
    },
    {
        "id": "khaby_lame",
        "name": "Khaby Lame Palms Up",
        "quotes": ["It's that simple", "Shrug"],
        "tags": ["real_person", "sarcasm", "reaction_face", "global"],
        "era": "2020s",
        "region": "global",
        "format": "video",
        "media_url": "https://media.giphy.com/media/26ueYUlPAmUkTBAM8/giphy.gif",
        "description": "Khaby Lame silently demonstrating easy solutions to overcomplicated life hacks."
    },
    {
        "id": "harambe",
        "name": "Harambe the Gorilla",
        "quotes": ["Dicks out for Harambe", "Never forget"],
        "tags": ["animal", "global", "troll", "old"],
        "era": "2010s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/020/700/harambe.jpg",
        "description": "Silverback gorilla whose tragic 2016 passing became a viral internet tribute culture."
    },
    {
        "id": "keyboard_cat",
        "name": "Keyboard Cat (Play Him Off)",
        "quotes": ["Play him off, Keyboard Cat!"],
        "tags": ["animal", "cat", "music", "old", "classic", "global"],
        "era": "2000s",
        "region": "global",
        "format": "video",
        "media_url": "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
        "description": "Orange tabby cat named Fatso wearing a blue shirt playing a electronic keyboard."
    },
    {
        "id": "mocking_spongebob",
        "name": "Mocking SpongeBob",
        "quotes": ["mOcKiNg SpOnGeBoB", "tYpInG lIkE tHiS"],
        "tags": ["cartoon", "sarcasm", "reaction_face", "global", "dialogue"],
        "era": "2010s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/022/940/mockingspongebob.jpg",
        "description": "SpongeBob acting like a chicken paired with alternating uppercase and lowercase text."
    },
    {
        "id": "side_eye_chloe",
        "name": "Side Eye Chloe",
        "quotes": ["WTF face", "Unimpressed"],
        "tags": ["real_person", "reaction_face", "child", "global", "classic"],
        "era": "2010s",
        "region": "global",
        "format": "image",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/014/285/sideeye.jpg",
        "description": "Young toddler in a car seat giving a skeptical side-eye expression."
    }
]

def seed_memes_collection(db_collection):
    """Seed initial memes into MongoDB if collection is empty."""
    count = db_collection.count_documents({})
    if count == 0:
        db_collection.insert_many(INITIAL_MEMES)
        print(f"Successfully seeded {len(INITIAL_MEMES)} memes into MongoDB!")
    else:
        print(f"MongoDB already contains {count} memes. Skipping initial seed.")
