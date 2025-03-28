import OpenAI from "openai";
const client = new OpenAI();

export async function beHelpful(suggestions) {
    const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: `You are a friendly axolotl called hypo-buddy designed to help users address some common causes of frequently-experienced small symptoms. Write a very brief, friendly, and cheerful suggestion that gently pushes the user to take the following action: ${suggestions}`
            },
        ],
    });

    return completion.choices[0].message.content;
}