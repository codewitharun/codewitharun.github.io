import React, { useState } from 'react';
import { HfInference } from '@huggingface/inference';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is imported

const AiTesting = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const HF_TOKEN = "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"

    async function ai() {
        try {
            setLoading(true);
            const inference = new HfInference(HF_TOKEN);
            const model = "mistralai/Mistral-7B-Instruct-v0.2";
            const userMessage = inputText;
            const output = await inference.chatCompletion({
                model,
                messages: [{ role: "user", content: userMessage }],

            });
            const botResponse = output.choices[0].message.content;
            setOutputText(botResponse);
            setConversation([{ user: inputText, bot: botResponse }, ...conversation]);
            setInputText('');
        } catch (error) {
            console.log("Error:", error)
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        ai();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Chhapri AI Interface</h1>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="flex items-center border-b border-b-2 border-teal-500 py-2 mb-4">
                        <input
                            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter input text"
                        />
                        <button
                            className={`flex-shrink-0 text-sm border-4 py-1 px-2 rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700'}`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Generating...' : 'Get Response'}
                        </button>
                    </div>
                </form>
                <div className="overflow-y-auto max-h-64">
                    <ul className="space-y-4">
                        {conversation.map((turn, index) => (
                            <li key={index} className="bg-gray-200 p-4 rounded-lg">
                                <p className="font-semibold"><b>You:</b> {turn.user}</p>
                                <p><b>Chhapri :</b> {turn.bot}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AiTesting;
