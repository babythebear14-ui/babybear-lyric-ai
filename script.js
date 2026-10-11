const genre = document.getElementById("genre");
const mood = document.getElementById("mood");
const language = document.getElementById("language");
const structure = document.getElementById("structure");
const topic = document.getElementById("topic");

const generateBtn = document.getElementById("generateBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const copyBtn = document.getElementById("copyBtn");
const saveBtn = document.getElementById("saveBtn");

const resultSection = document.getElementById("resultSection");
const lyricsOutput = document.getElementById("lyricsOutput");
const charCount = document.getElementById("charCount");
const savedLyrics = document.getElementById("savedLyrics");

let lastLyrics = "";
let lastTitle = "";

// Count characters in the topic box
topic.addEventListener("input", () => {
charCount.textContent = topic.value.length;
});

// Simple starter generator — not real AI
function generateLyrics() {
const songTopic = topic.value.trim();

if (!songTopic) {
    alert("🎤 Enter a song topic first!");
    topic.focus();
    return;
}

const selectedGenre = genre.value;
const selectedMood = mood.value;
const selectedLanguage = language.value;
const selectedStructure = structure.value;

const subject = songTopic;
const title = subject.split(/\s+/).slice(0, 5).join(" ");

const hooks = [
    `I came from the bottom, now I'm chasing my dreams`,
    `Through the pain and the pressure, I'm becoming a king`,
    `They don't know my story, they don't know what I've seen`,
    `I keep moving forward, got my eyes on the dream`
];

const verses = [
    `Late nights thinking about the life I want to live,\nLearning every lesson, giving everything I give.\nEvery disappointment made me stronger than before,\nNow I'm building up my future, I won't settle anymore.`,
    `I had days when the road felt longer than the miles,\nHad to hide the pain and keep a smile for a while.\nNow I'm turning every setback into something I can use,\nI have dreams inside my heart and too much left to lose.`,
    `I remember all the moments when nobody understood,\nHad to find a little courage, had to make my mindset good.\nNow I'm working on tomorrow, putting purpose in my plans,\nBuilding something for my future with these two hardworking hands.`
];

const emotionalHooks = [
    `Behind this smile, there are stories I don't tell`,
    `I've been through the fire, but I'm wishing you well`,
    `Every scar reminds me of the nights I survived`,
    `Even when it's raining, I keep hope alive`
];

const romanticHooks = [
    `You bring a little sunshine to the rain inside my heart`,
    `Even when we're miles away, we're never truly apart`,
    `Every little moment feels like music in the air`,
    `If the world was falling, I'd still want you there`
];

const motivationalHooks = [
    `No stopping now, I've got a future to create`,
    `Every little sacrifice is worth the dream I chase`,
    `Started with a vision, now I'm building every day`,
    `I will keep on moving, nothing standing in my way`
];

const random = array => array[Math.floor(Math.random() * array.length)];

let hook;

if (selectedMood === "Romantic") {
    hook = romanticHooks;
} else if (selectedMood === "Motivational" || selectedMood === "Confident") {
    hook = motivationalHooks;
} else if (selectedMood === "Emotional" || selectedMood === "Sad") {
    hook = emotionalHooks;
} else {
    hook = hooks;
}

const chorus = `[CHORUS]\n${random(hook)}\n${random(hook)}\n${random(hook)}\n${random(hook)}`;

const verse = `[VERSE 1]\n${random(verses)}\n\n[VERSE 2]\n${random(verses)}`;

const intro = `[INTRO]\nYeah, yeah...\nBabybear on the sound.\nThis one's about ${subject}.\n`;

const outro = `[OUTRO]\nOne day at a time.\nOne dream at a time.\nMy story isn't over.`;

let lyrics = "";

if (selectedStructure === "Chorus only") {
    lyrics = chorus;
} else if (selectedStructure === "Verse only") {
    lyrics = verse;
} else if (selectedStructure === "Freestyle") {
    lyrics = `${intro}\n${verse}\n\n${chorus}`;
} else {
    lyrics = `${intro}\n${chorus}\n\n${verse}\n\n${chorus}\n\n${outro}`;
}

if (selectedLanguage === "Chichewa") {
    lyrics = `[CHICHEWA MODE]\n\n${lyrics}\n\nNote: This starter version uses mostly English templates. Real Chichewa generation will be added with AI.`;
} else if (selectedLanguage === "English mixed with Chichewa") {
    lyrics = `[ENGLISH + CHICHEWA MODE]\n\n${lyrics}\n\nNote: Mixed-language generation will improve when we connect real AI.`;
}

lastLyrics = lyrics;
lastTitle = title;

lyricsOutput.textContent =
    `TITLE: ${title}\nGENRE: ${selectedGenre}\nMOOD: ${selectedMood}\n\n${lyrics}`;

resultSection.classList.remove("hidden");

resultSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
});

}

// Generate lyrics
generateBtn.addEventListener("click", () => {
generateLyrics();
});

// Generate another version
regenerateBtn.addEventListener("click", () => {
generateLyrics();
});

// Copy lyrics
copyBtn.addEventListener("click", async () => {
const text = lyricsOutput.textContent;

try {
    await navigator.clipboard.writeText(text);
    alert("✅ Lyrics copied!");
} catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    alert("✅ Lyrics copied!");
}

});

// Load saved lyrics
function renderSavedLyrics() {
savedLyrics.innerHTML = "";

let saved = [];

try {
    saved = JSON.parse(localStorage.getItem("babybearSavedLyrics")) || [];
} catch (error) {
    saved = [];
}

if (saved.length === 0) {
    savedLyrics.innerHTML =
        '<p style="color:#9896ac;font-size:12px;margin-top:12px;">No saved lyrics yet. Create something you love! 🎵</p>';
    return;
}

saved.forEach((item, index) => {
    const container = document.createElement("div");
    container.className = "saved-item";

    const heading = document.createElement("h4");
    heading.textContent = item.title;

    const preview = document.createElement("p");
    preview.textContent = item.lyrics.slice(0, 180) + "...";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Delete";
    deleteBtn.addEventListener("click", () => {
        deleteSavedLyrics(index);
    });

    container.appendChild(heading);
    container.appendChild(preview);
    container.appendChild(deleteBtn);

    savedLyrics.appendChild(container);
});

}

// Save current lyrics
saveBtn.addEventListener("click", () => {
if (!lastLyrics) {
alert("Generate some lyrics first!");
return;
}

let saved = [];

try {
    saved = JSON.parse(localStorage.getItem("babybearSavedLyrics")) || [];
} catch (error) {
    saved = [];
}

saved.unshift({
    title: lastTitle || "My song",
    lyrics: lyricsOutput.textContent,
    date: new Date().toISOString()
});

try {
    localStorage.setItem("babybearSavedLyrics", JSON.stringify(saved));
    renderSavedLyrics();
    alert("❤️ Lyrics saved!");
} catch (error) {
    alert("Unable to save lyrics. Your browser storage may be full.");
}

});

// Delete saved lyrics
function deleteSavedLyrics(index) {
let saved = [];

try {
    saved = JSON.parse(localStorage.getItem("babybearSavedLyrics")) || [];
} catch (error) {
    saved = [];
}

saved.splice(index, 1);
localStorage.setItem("babybearSavedLyrics", JSON.stringify(saved));

renderSavedLyrics();

}

// Initial setup
renderSavedLyrics();

console.log("🎤 Babybear Lyric AI is ready!");