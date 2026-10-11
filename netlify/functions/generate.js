exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const topic = String(data.topic || "").slice(0, 1000);
    const genre = String(data.genre || "Afrotrap").slice(0, 100);
    const mood = String(data.mood || "Confident").slice(0, 100);
    const language = String(data.language || "English").slice(0, 100);
    const structure = String(data.structure || "Verse and chorus").slice(0, 100);

    if (!topic.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Please enter a song topic." })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Gemini API key is not configured.");
    }

    const prompt = `
You are Babybear Lyric AI, a creative songwriting assistant.

Write original song lyrics using these preferences:
Genre: ${genre}
Mood: ${mood}
Language: ${language}
Structure: ${structure}
Topic: ${topic}

Write fresh, original lyrics. Do not copy existing songs.
Give the song a suitable title and use clear section labels.
Return only the title and lyrics.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", result);
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "Gemini couldn't generate lyrics. Please try again."
        })
      };
    }

    const lyrics =
      result.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("\n")
        .trim();

    if (!lyrics) {
      throw new Error("Gemini returned an empty response.");
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ lyrics })
    };
  } catch (error) {
    console.error("Lyric generation error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong while generating lyrics."
      })
    };
  }
};
