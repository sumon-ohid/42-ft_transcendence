// NOTE: chat in the chat page with AI
// Using the OpenRouter API to chat with an AI assistant
// Free AI model: meta-llama/llama-3.2-90b-vision-instruct:free
class AIChat {
    constructor() {
        this.apiKey = null;
        this.chatHistory = [];
        this.isTyping = false;
    }

    async initialize(apiKey) {

        let command = `You are an AI assistant for the ft_transcendence Pong game project. You are knowledgeable about:
            - Backend: Django framework
            - Frontend: Bootstrap toolkit
            - Database: PostgreSQL
            - Blockchain: Ethereum for storing tournament scores
            - Authentication: 42 API integration and JWT with 2FA
            - Game features: 2-Player Pong, 4-player Pong, Tournament, game customization, live chat
            - Statistics: User and game stats tracking
            - Browser support: Works across all modern browsers

            Keep responses concise, friendly, and focused on the project. Help users with game-related questions,
            technical issues, 42 Vienna and everything about tech stacks used in the project.`

        this.apiKey = apiKey;
        this.chatHistory = [{
            role: "system",
            content: command
        }];
    }

    async sendMessage(message) {
        if (!this.apiKey) {
            throw new Error("OpenRouter API key not set");
        }

        this.chatHistory.push({ role: "user", content: message });
        this.isTyping = true;

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3.2-90b-vision-instruct:free",
                    messages: this.chatHistory
                })
            });

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            this.chatHistory.push({ role: "assistant", content: aiResponse });
            this.isTyping = false;
            
            return aiResponse;
        } catch (error) {
            this.isTyping = false;
            throw error;
        }
    }

    clearHistory() {
        this.chatHistory = [{
            role: "system",
            content: "You are an AI assistant for the ft_transcendence Pong game project. You are knowledgeable about it"
        }];
    }
}

const aiChat = new AIChat();

window.addEventListener('load', async () => {
    try {
        // NOTE: use .env file to store the API key
        // const response = await fetch('/api/get-openrouter-key/');
        // const data = await response.json();
        await aiChat.initialize("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");
    } catch (error) {
        console.error('Failed to initialize AI chat:', error);
    }
});

window.startAIChat = async function() {
    //-- Clear previous chat
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = '';
    
    //-- Set up AI chat interface
    const chatTopBar = document.querySelector('.chat-top-bar');
    chatTopBar.innerHTML = `
        <div class="chating-with">
            <div class="friend-name">
                <h1>Marvin</h1>
                <span id="active-now" class="badge rounded-pill text-bg-warning">Always Active</span>
            </div>
            <div class="p-pic-back"></div>
            <img src="/static/images/robot.png" alt="AI Bot">
        </div>
    `;

    const chatInput = document.getElementById("chat-input");
    chatInput.classList.remove('disabled');
    chatInput.style.pointerEvents = 'auto';
    chatInput.placeholder = "Ask me anything...";

    // Send message when user presses Enter key or clicks the send button
    chatInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("send-button").click();
        }
    });

    const sendButton = document.getElementById("send-button");
    sendButton.onclick = async function() {
        const message = chatInput.value.trim();
        if (message) {
            // user message
            displayAIMessage({ sender: 'You', text: message });
            chatInput.value = '';

            const thinkingMessageId = displayAIMessage({ sender: 'Marvin', text: ' thinking...' });
            // AI response
            try {
                const response = await aiChat.sendMessage(message);
                removeMessage(thinkingMessageId);
                displayAIMessage({ sender: 'Marvin', text: response });
            } catch (error) {
                removeMessage(thinkingMessageId);
                displayAIMessage({ sender: 'System', text: 'Error: Failed to get AI response' });
            }
        }
    };
};

function formatMessageContent(text) {
    // Detect code blocks
    if (text.includes('```')) {
        const codeBlocks = text.split('```');
        const formattedBlocks = codeBlocks.map((block, index) => {
            if (index % 2 === 1) { // Odd indices are code blocks
                const codeElement = document.createElement('pre');
                codeElement.className = 'code-block';
                codeElement.textContent = block;
                return codeElement.outerHTML;
            }
            return block;
        });
        return formattedBlocks.join('');
    }

    // Detect tables
    if (text.includes('|')) {
        const lines = text.split('\n');
        if (lines.some(line => line.trim().startsWith('|'))) {
            const table = document.createElement('table');
            table.className = 'ai-table';
            lines.forEach(line => {
                if (line.trim().startsWith('|')) {
                    const row = document.createElement('tr');
                    line.split('|').slice(1, -1).forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell.trim();
                        row.appendChild(td);
                    });
                    table.appendChild(row);
                }
            });
            return table.outerHTML;
        }
    }

    // Detect lists
    if (text.includes('* ') || text.includes('- ')) {
        const lines = text.split('\n');
        if (lines.some(line => line.trim().startsWith('* ') || line.trim().startsWith('- '))) {
            const list = document.createElement('ul');
            list.className = 'ai-list';
            lines.forEach(line => {
                if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                    const li = document.createElement('li');
                    li.textContent = line.trim().substring(2);
                    list.appendChild(li);
                }
            });
            return list.outerHTML;
        }
    }

    // Default to plain text
    return text;
}

function displayAIMessage(message) {
    const chatMessages = document.getElementById("chat-messages");
    
    const messageElement = document.createElement("div");
    messageElement.className = "chat-message";
    if (message.sender === 'Marvin' || message.sender === 'System') {
        messageElement.classList.add("other-user-message");
    }
    
    const profilePic = document.createElement("img");
    profilePic.src = message.sender === 'Marvin' ? "/static/images/robot.png" : profilePicture;
    if (message.sender === 'System') {
        profilePic.src = "/static/images/robot.png";
    }

    profilePic.alt = "Profile Picture";
    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    if (message.sender !== 'Marvin' && message.sender !== 'System') {
        messageContent.style.color = "black";
    }
    messageContent.innerHTML = formatMessageContent(message.text);
    messageElement.appendChild(profilePic);
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageElement.id = `message-${Date.now()}`;
}

function removeMessage(messageId) {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
        messageElement.remove();
    }
}
